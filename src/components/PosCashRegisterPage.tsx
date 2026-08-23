import React, { useState, useEffect, useMemo } from 'react';
import {
  CreditCard,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Search,
  ArrowDownLeft,
  Lock,
  Unlock,
  AlertTriangle,
  Receipt,
  User,
  Scissors,
  ShoppingBag,
  Sparkles,
  Printer,
  History,
  TrendingDown,
  TrendingUp,
  MessageCircle,
  HelpCircle,
  Clock,
  Send,
  Calendar,
  Check,
  ChevronRight,
  ShieldCheck,
  Layers,
  Zap
} from 'lucide-react';
import { Service, Product, Stylist, Client, CashShift, CashMovement, PosSale, PosSaleItem } from '../types';

interface PosCashRegisterPageProps {
  theme: 'dark' | 'light';
  salonName: string;
  salonCurrency: string;
  services: Service[];
  products: Product[];
  stylists: Stylist[];
  clients: Client[];
  ownerName?: string;
  initialCartClient?: Client | null;
  onBackToOverview: () => void;
}

export const PosCashRegisterPage: React.FC<PosCashRegisterPageProps> = ({
  theme,
  salonName,
  salonCurrency = 'COP',
  services = [],
  products = [],
  stylists = [],
  clients = [],
  ownerName = 'Tulio Páez',
  initialCartClient = null,
  onBackToOverview
}) => {
  const isDark = theme === 'dark';

  // 1. Estado de Turno de Caja (Activo / Histórico)
  const [activeShift, setActiveShift] = useState<CashShift | null>(() => {
    const saved = localStorage.getItem('bf_pos_active_shift_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Estado inicial de demostración: Caja Abierta con $100.000 COP
    return {
      id: 'shift-' + Date.now().toString().slice(-6),
      tenant_id: '00000000-0000-0000-0000-000000000001',
      opened_by_name: ownerName || 'Administrador',
      opened_at: new Date().toISOString(),
      initial_amount_cop: 100000,
      opening_notes: 'Base inicial en efectivo para cambio',
      status: 'open',
      total_sales_cop: 0,
      total_cash_sales_cop: 0,
      total_card_sales_cop: 0,
      total_digital_sales_cop: 0,
      total_expenses_cop: 0,
      total_incomes_cop: 0,
      total_commissions_cop: 0
    };
  });

  const [shiftsHistory, setShiftsHistory] = useState<CashShift[]>(() => {
    const saved = localStorage.getItem('bf_pos_shifts_history_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'shift-hist-001',
        tenant_id: '00000000-0000-0000-0000-000000000001',
        opened_by_name: ownerName || 'Tulio Páez',
        opened_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        initial_amount_cop: 120000,
        status: 'closed',
        closed_by_name: ownerName || 'Tulio Páez',
        closed_at: new Date(Date.now() - 86400000 * 2 + 3600000 * 9).toISOString(),
        expected_cash_cop: 480000,
        actual_cash_cop: 480000,
        difference_cash_cop: 0,
        total_sales_cop: 760000,
        total_cash_sales_cop: 360000,
        total_card_sales_cop: 220000,
        total_digital_sales_cop: 180000,
        total_expenses_cop: 0,
        total_incomes_cop: 0,
        total_commissions_cop: 342000,
        closing_notes: 'Turno cuadrado perfecto sin novedades.'
      }
    ];
  });

  const [movements, setMovements] = useState<CashMovement[]>(() => {
    const saved = localStorage.getItem('bf_pos_movements_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const [sales, setSales] = useState<PosSale[]>(() => {
    const saved = localStorage.getItem('bf_pos_sales_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const [paidCommissions, setPaidCommissions] = useState<Array<{
    id: string;
    shift_id: string;
    stylist_name: string;
    amount_cop: number;
    paid_at: string;
  }>>(() => {
    const saved = localStorage.getItem('bf_pos_paid_commissions_v1');
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar en LocalStorage cada cambio
  useEffect(() => {
    if (activeShift) {
      localStorage.setItem('bf_pos_active_shift_v1', JSON.stringify(activeShift));
    } else {
      localStorage.removeItem('bf_pos_active_shift_v1');
    }
  }, [activeShift]);

  useEffect(() => {
    localStorage.setItem('bf_pos_shifts_history_v1', JSON.stringify(shiftsHistory));
  }, [shiftsHistory]);

  useEffect(() => {
    localStorage.setItem('bf_pos_movements_v1', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('bf_pos_sales_v1', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('bf_pos_paid_commissions_v1', JSON.stringify(paidCommissions));
  }, [paidCommissions]);

  // 2. Subpestañas del POS
  const [posTab, setPosTab] = useState<'terminal' | 'movements' | 'commissions' | 'closing' | 'history'>('terminal');
  const [commissionsTimeRange, setCommissionsTimeRange] = useState<'current_shift' | 'all_time'>('current_shift');
  const [selectedStylistDetail, setSelectedStylistDetail] = useState<{
    stylistName: string;
    stylistSpecialty: string;
    stylistCommissionServicePct: number;
    stylistCommissionRetailPct: number;
    servicesCount: number;
    grossServicesCop: number;
    commServicesCop: number;
    retailCount: number;
    grossRetailCop: number;
    commRetailCop: number;
    totalCommCop: number;
    commPaidCop: number;
    pendingCommCop: number;
    totalGrossCop: number;
    items: Array<{
      saleNumber: string;
      clientName: string;
      date: string;
      item: PosSaleItem;
    }>;
  } | null>(null);

  // 3. Estado de la Terminal de Ventas (Carrito & Checkout)
  const [cartItems, setCartItems] = useState<PosSaleItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(initialCartClient);
  const [clientSearch, setClientSearch] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [catalogCategory, setCatalogCategory] = useState<string>('all');
  const [catalogSearch, setCatalogSearch] = useState<string>('');

  // Descuentos y Propinas
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [discountVal, setDiscountVal] = useState<number>(0);
  const [tipVal, setTipVal] = useState<number>(0);
  const [depositDeduction, setDepositDeduction] = useState<number>(0);

  // 3b. Modal de Cobro Adicional / Recargo Extra
  const [isExtraChargeModalOpen, setIsExtraChargeModalOpen] = useState(false);
  const [extraConcept, setExtraConcept] = useState<string>('');
  const [extraAmount, setExtraAmount] = useState<number>(15000);
  const [extraStylistName, setExtraStylistName] = useState<string>(stylists[0]?.name || ownerName);
  const [extraCommissionPct, setExtraCommissionPct] = useState<number>(50);

  // Modal de Cobro (Checkout)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'nequi' | 'daviplata' | 'tarjeta' | 'transferencia' | 'mixto'>('efectivo');
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [mixedCash, setMixedCash] = useState<number>(0);
  const [mixedDigital, setMixedDigital] = useState<number>(0);
  const [digitalReferenceCode, setDigitalReferenceCode] = useState<string>('');
  const [cardType, setCardType] = useState<'debito' | 'credito'>('debito');
  const [bankName, setBankName] = useState<string>('Bancolombia');
  const [sendWhatsAppReceipt, setSendWhatsAppReceipt] = useState<boolean>(true);
  const [saleNotes, setSaleNotes] = useState<string>('');
  const [lastCompletedSale, setLastCompletedSale] = useState<PosSale | null>(null);

  // Modal de Confirmación de Pago de Comisiones a Especialistas
  const [payoutConfirmData, setPayoutConfirmData] = useState<{
    stylistName: string;
    amountCop: number;
    paymentMethod: 'cash' | 'transfer';
  } | null>(null);

  // 4. Modal de Apertura de Caja
  const [isOpeningModalOpen, setIsOpeningModalOpen] = useState(false);
  const [openBaseCash, setOpenBaseCash] = useState<number>(100000);
  const [openResponsible, setOpenResponsible] = useState<string>(ownerName || 'Tulio Páez');
  const [openNotes, setOpenNotes] = useState<string>('Base de efectivo inicial');

  // 5. Modal de Movimiento de Caja Chica
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movType, setMovType] = useState<'expense' | 'income'>('expense');
  const [movCategory, setMovCategory] = useState<'insumos' | 'servicios' | 'cafe_alimentos' | 'domicilios' | 'propinas' | 'otro'>('insumos');
  const [movAmount, setMovAmount] = useState<number>(0);
  const [movDesc, setMovDesc] = useState<string>('');

  // 6. Estado de Cierre de Caja / Arqueo
  const [countedCash, setCountedCash] = useState<number>(0);
  const [closingNotes, setClosingNotes] = useState<string>('');
  const [showZReportModal, setShowZReportModal] = useState<CashShift | null>(null);

  // ---------------------------------------------------------------------------
  // CÁLCULOS FINANCIEROS DEL TURNO EN VIVO
  // ---------------------------------------------------------------------------
  const currentShiftSales = useMemo(() => {
    if (!activeShift) return [];
    return sales.filter(s => s.shift_id === activeShift.id);
  }, [sales, activeShift]);

  const currentShiftMovements = useMemo(() => {
    if (!activeShift) return [];
    return movements.filter(m => m.shift_id === activeShift.id);
  }, [movements, activeShift]);

  const totalSalesCash = useMemo(() => {
    return currentShiftSales.reduce((acc, s) => {
      if (s.payment_method === 'efectivo') return acc + s.total_cop;
      if (s.payment_method === 'mixto' && s.payment_breakdown?.cash_cop) return acc + s.payment_breakdown.cash_cop;
      return acc;
    }, 0);
  }, [currentShiftSales]);

  const totalSalesCard = useMemo(() => {
    return currentShiftSales.reduce((acc, s) => {
      if (s.payment_method === 'tarjeta') return acc + s.total_cop;
      if (s.payment_method === 'mixto' && s.payment_breakdown?.card_cop) return acc + s.payment_breakdown.card_cop;
      return acc;
    }, 0);
  }, [currentShiftSales]);

  const totalSalesDigital = useMemo(() => {
    return currentShiftSales.reduce((acc, s) => {
      if (s.payment_method === 'nequi' || s.payment_method === 'daviplata' || s.payment_method === 'transferencia') return acc + s.total_cop;
      if (s.payment_method === 'mixto' && (s.payment_breakdown?.nequi_daviplata_cop || s.payment_breakdown?.transfer_cop)) {
        return acc + (s.payment_breakdown.nequi_daviplata_cop || 0) + (s.payment_breakdown.transfer_cop || 0);
      }
      return acc;
    }, 0);
  }, [currentShiftSales]);

  const totalTurnover = useMemo(() => {
    return currentShiftSales.reduce((acc, s) => acc + s.total_cop, 0);
  }, [currentShiftSales]);

  const totalExpensesCash = useMemo(() => {
    return currentShiftMovements
      .filter(m => m.type === 'expense')
      .reduce((acc, m) => acc + m.amount_cop, 0);
  }, [currentShiftMovements]);

  const totalIncomesCash = useMemo(() => {
    return currentShiftMovements
      .filter(m => m.type === 'income')
      .reduce((acc, m) => acc + m.amount_cop, 0);
  }, [currentShiftMovements]);

  const totalCommissionsEarned = useMemo(() => {
    return currentShiftSales.reduce((acc, s) => acc + s.total_commissions_cop, 0);
  }, [currentShiftSales]);

  const expectedCashInDrawer = useMemo(() => {
    const base = activeShift?.initial_amount_cop || 0;
    return base + totalSalesCash + totalIncomesCash - totalExpensesCash;
  }, [activeShift, totalSalesCash, totalIncomesCash, totalExpensesCash]);

  const cashDifference = countedCash - expectedCashInDrawer;

  // Liquidación de comisiones agrupadas por estilista
  const commissionsByStylist = useMemo(() => {
    const map: { [stylistName: string]: { servicesCop: number; retailCop: number; totalCop: number } } = {};
    currentShiftSales.forEach(s => {
      s.items.forEach(it => {
        const sName = it.stylist_name || 'Sin Asignar';
        if (!map[sName]) map[sName] = { servicesCop: 0, retailCop: 0, totalCop: 0 };
        const comm = it.commission_amount_cop || 0;
        if (it.type === 'service') {
          map[sName].servicesCop += comm;
        } else {
          map[sName].retailCop += comm;
        }
        map[sName].totalCop += comm;
      });
    });
    return map;
  }, [currentShiftSales]);

  // Reporte Detallado de Comisiones para la Pestaña Especial de Comisiones
  const detailedStylistCommissions = useMemo(() => {
    const targetSales = commissionsTimeRange === 'current_shift' ? currentShiftSales : sales;

    return stylists.map(st => {
      const matchedSalesItems: Array<{
        saleNumber: string;
        clientName: string;
        date: string;
        item: PosSaleItem;
      }> = [];

      targetSales.forEach(s => {
        s.items.forEach(it => {
          if (it.stylist_name === st.name || it.stylist_id === st.id) {
            matchedSalesItems.push({
              saleNumber: s.sale_number,
              clientName: s.client_name,
              date: s.created_at,
              item: it
            });
          }
        });
      });

      const servicesItems = matchedSalesItems.filter(entry => entry.item.type === 'service');
      const retailItems = matchedSalesItems.filter(entry => entry.item.type === 'retail');

      const grossServicesCop = servicesItems.reduce((acc, entry) => acc + entry.item.total_cop, 0);
      const grossRetailCop = retailItems.reduce((acc, entry) => acc + entry.item.total_cop, 0);

      const commServicesCop = servicesItems.reduce((acc, entry) => acc + (entry.item.commission_amount_cop || 0), 0);
      const commRetailCop = retailItems.reduce((acc, entry) => acc + (entry.item.commission_amount_cop || 0), 0);

      const totalCommCop = commServicesCop + commRetailCop;
      const totalGrossCop = grossServicesCop + grossRetailCop;

      const commPaidCop = paidCommissions
        .filter(p => p.stylist_name === st.name && (commissionsTimeRange === 'current_shift' ? p.shift_id === activeShift?.id : true))
        .reduce((acc, p) => acc + p.amount_cop, 0);

      const pendingCommCop = Math.max(0, totalCommCop - commPaidCop);

      return {
        stylist: st,
        servicesCount: servicesItems.length,
        grossServicesCop,
        commServicesCop,
        retailCount: retailItems.length,
        grossRetailCop,
        commRetailCop,
        totalCommCop,
        commPaidCop,
        pendingCommCop,
        totalGrossCop,
        items: matchedSalesItems
      };
    });
  }, [stylists, commissionsTimeRange, currentShiftSales, sales, paidCommissions, activeShift]);

  const totalPendingCommissionsDetailed = useMemo(() => {
    return detailedStylistCommissions.reduce((acc, d) => acc + d.pendingCommCop, 0);
  }, [detailedStylistCommissions]);

  const totalCommissionsEarnedDetailed = useMemo(() => {
    return detailedStylistCommissions.reduce((acc, d) => acc + d.totalCommCop, 0);
  }, [detailedStylistCommissions]);

  const totalCommissionsPaidDetailed = useMemo(() => {
    return detailedStylistCommissions.reduce((acc, d) => acc + d.commPaidCop, 0);
  }, [detailedStylistCommissions]);

  const totalGrossDetailed = useMemo(() => {
    return detailedStylistCommissions.reduce((acc, d) => acc + d.totalGrossCop, 0);
  }, [detailedStylistCommissions]);

  const topStylist = useMemo(() => {
    if (detailedStylistCommissions.length === 0) return null;
    const sorted = [...detailedStylistCommissions].sort((a, b) => b.totalGrossCop - a.totalGrossCop);
    return sorted[0]?.totalGrossCop > 0 ? sorted[0] : null;
  }, [detailedStylistCommissions]);

  const handlePayStylistCommission = (stylistName: string, amountCop: number) => {
    if (!activeShift) {
      setIsOpeningModalOpen(true);
      return;
    }
    if (amountCop <= 0) return;

    setPayoutConfirmData({
      stylistName,
      amountCop,
      paymentMethod: 'cash'
    });
  };

  const handleExecuteCommissionPayout = () => {
    if (!payoutConfirmData || !activeShift) return;
    const { stylistName, amountCop, paymentMethod } = payoutConfirmData;

    const newMov: CashMovement = {
      id: 'mov-' + Date.now(),
      shift_id: activeShift.id,
      tenant_id: activeShift.tenant_id,
      type: 'expense',
      category: 'propinas',
      amount_cop: amountCop,
      description: `Pago / Liquidación de comisiones (${paymentMethod === 'cash' ? 'Efectivo caja' : 'Transferencia'}) a ${stylistName}`,
      created_by_name: ownerName || 'Tulio Páez',
      created_at: new Date().toISOString()
    };

    const newPayout = {
      id: 'payout-' + Date.now(),
      shift_id: activeShift.id,
      stylist_name: stylistName,
      amount_cop: amountCop,
      paid_at: new Date().toISOString()
    };

    setMovements(prev => [newMov, ...prev]);
    setPaidCommissions(prev => [newPayout, ...prev]);
    setPayoutConfirmData(null);
  };

  const handleSendWhatsAppReceipt = (sale: PosSale) => {
    const itemsList = sale.items
      .map(it => `• *${it.quantity}x* ${it.name} - $${it.total_cop.toLocaleString()} ${salonCurrency} _(${it.stylist_name || 'Salón'})_`)
      .join('\n');

    const methodLabels: Record<string, string> = {
      efectivo: '💵 Efectivo',
      nequi: '💜 Nequi',
      daviplata: '🔴 Daviplata',
      tarjeta: '💳 Datáfono / Tarjeta',
      transferencia: '🏦 Transferencia Bancaria',
      mixto: '⚡ Pago Mixto (Efectivo + Digital)'
    };

    const text = `🌸 *Comprobante de Pago - ${salonName}*\n\n¡Gracias por tu visita! ✨ Aquí tienes el detalle oficial de tu recibo:\n\n📄 *Ticket:* #${sale.sale_number}\n📅 *Fecha:* ${new Date(sale.created_at).toLocaleDateString()} ${new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n👤 *Cliente:* ${sale.client_name}\n\n*Detalle de Servicios & Productos:*\n${itemsList}\n\n${sale.discount_amount_cop ? `🎁 *Descuento Aplicado:* -$${sale.discount_amount_cop.toLocaleString()} ${salonCurrency}\n` : ''}${sale.deposit_deducted_cop ? `🏷️ *Anticipo Deducido:* -$${sale.deposit_deducted_cop.toLocaleString()} ${salonCurrency}\n` : ''}💰 *TOTAL PAGADO:* $${sale.total_cop.toLocaleString()} ${salonCurrency}\n💳 *Método de Pago:* ${methodLabels[sale.payment_method] || sale.payment_method.toUpperCase()}${sale.payment_method === 'efectivo' && sale.change_returned_cop ? `\n🪙 *Cambio / Vuelto:* $${sale.change_returned_cop.toLocaleString()} ${salonCurrency}` : ''}\n\n_¡Esperamos verte pronto de nuevo! 💖_\n_${salonName} - Gestión Inteligente_`;

    const cleanPhone = (sale.client_phone || '').replace(/\D/g, '');
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSendStylistWhatsApp = (stylistName: string, stylistPhone: string, totalComm: number, grossSales: number, servicesCount: number) => {
    const text = `💈 *Liquidación de Comisiones - ${salonName}*\n\n¡Hola ${stylistName}! 👋 Aquí tienes el resumen de tu producción:\n\n✨ *Servicios atendidos:* ${servicesCount}\n💵 *Total Facturado:* $${grossSales.toLocaleString()} ${salonCurrency}\n💰 *Total Comisión Ganada:* $${totalComm.toLocaleString()} ${salonCurrency}\n\n_BeautyFlow AI - Sistema de Gestión_`;
    const cleanPhone = (stylistPhone || '').replace(/\D/g, '');
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // ---------------------------------------------------------------------------
  // CÁLCULOS DEL CARRITO ACTUAL
  // ---------------------------------------------------------------------------
  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, it) => acc + it.total_cop, 0);
  }, [cartItems]);

  const computedDiscount = useMemo(() => {
    if (discountType === 'percent') {
      return (cartSubtotal * Math.min(100, Math.max(0, discountVal))) / 100;
    }
    return Math.min(cartSubtotal, Math.max(0, discountVal));
  }, [cartSubtotal, discountType, discountVal]);

  const cartTotalToPay = useMemo(() => {
    const base = cartSubtotal - computedDiscount - depositDeduction + tipVal;
    return Math.max(0, base);
  }, [cartSubtotal, computedDiscount, depositDeduction, tipVal]);

  const changeDue = useMemo(() => {
    if (paymentMethod === 'efectivo') {
      return Math.max(0, cashReceived - cartTotalToPay);
    }
    return 0;
  }, [cashReceived, cartTotalToPay, paymentMethod]);

  // ---------------------------------------------------------------------------
  // HANDLERS: CARRITO
  // ---------------------------------------------------------------------------
  const handleAddItemToCart = (item: Service | Product, type: 'service' | 'retail') => {
    if (!activeShift) {
      setIsOpeningModalOpen(true);
      return;
    }

    const defaultStylist = stylists[0] || { name: ownerName, commission_service_pct: 50, commission_retail_pct: 10 };
    const commPct = type === 'service' 
      ? (defaultStylist.commission_service_pct ?? 50) 
      : (defaultStylist.commission_retail_pct ?? 10);

    const price = type === 'service' 
      ? ((item as Service).price_usd || 45000) 
      : ((item as Product).price_usd || 32000);

    const existingIdx = cartItems.findIndex(ci => ci.item_id === item.id);
    if (existingIdx >= 0) {
      const updated = [...cartItems];
      updated[existingIdx].quantity += 1;
      updated[existingIdx].total_cop = updated[existingIdx].quantity * updated[existingIdx].unit_price_cop;
      updated[existingIdx].commission_amount_cop = (updated[existingIdx].total_cop * (updated[existingIdx].commission_pct || 50)) / 100;
      setCartItems(updated);
    } else {
      const newItem: PosSaleItem = {
        id: 'ci-' + Date.now() + Math.random().toString(36).slice(-3),
        item_id: item.id,
        name: item.name,
        type,
        quantity: 1,
        unit_price_cop: price,
        total_cop: price,
        stylist_id: defaultStylist.id,
        stylist_name: defaultStylist.name,
        commission_pct: commPct,
        commission_amount_cop: (price * commPct) / 100
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const handleUpdateItemStylist = (itemId: string, stylistName: string) => {
    const st = stylists.find(s => s.name === stylistName);
    setCartItems(prev => prev.map(ci => {
      if (ci.id !== itemId) return ci;
      const commPct = ci.type === 'service' 
        ? (st?.commission_service_pct ?? 50) 
        : (st?.commission_retail_pct ?? 10);
      return {
        ...ci,
        stylist_id: st?.id,
        stylist_name: stylistName,
        commission_pct: commPct,
        commission_amount_cop: (ci.total_cop * commPct) / 100
      };
    }));
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems(prev => prev.map(ci => {
      if (ci.id !== itemId) return ci;
      const newQ = Math.max(1, ci.quantity + delta);
      const total = newQ * ci.unit_price_cop;
      return {
        ...ci,
        quantity: newQ,
        total_cop: total,
        commission_amount_cop: (total * (ci.commission_pct || 50)) / 100
      };
    }));
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems(prev => prev.filter(ci => ci.id !== itemId));
  };

  const handleAddExtraCharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift) {
      setIsOpeningModalOpen(true);
      return;
    }
    if (extraAmount <= 0 || !extraConcept.trim()) return;

    const st = stylists.find(s => s.name === extraStylistName) || stylists[0];
    const commAmt = (extraAmount * (extraCommissionPct || 50)) / 100;

    const extraItem: PosSaleItem = {
      id: 'ci-extra-' + Date.now() + Math.random().toString(36).slice(-3),
      item_id: 'extra-' + Date.now(),
      name: `⚡ ${extraConcept.trim()}`,
      type: 'service',
      quantity: 1,
      unit_price_cop: extraAmount,
      total_cop: extraAmount,
      stylist_id: st?.id,
      stylist_name: st?.name || extraStylistName,
      commission_pct: extraCommissionPct,
      commission_amount_cop: commAmt
    };

    setCartItems(prev => [...prev, extraItem]);
    setIsExtraChargeModalOpen(false);
    setExtraConcept('');
    setExtraAmount(15000);
  };

  // ---------------------------------------------------------------------------
  // HANDLERS: CHECKOUT & PROCESAMIENTO DE PAGO
  // ---------------------------------------------------------------------------
  const handleOpenCheckout = () => {
    if (cartItems.length === 0) return;
    setCashReceived(cartTotalToPay);
    setMixedCash(Math.round(cartTotalToPay / 2));
    setMixedDigital(Math.round(cartTotalToPay / 2));
    setIsCheckoutOpen(true);
  };

  const handleConfirmCheckout = () => {
    if (!activeShift) return;

    const totalCommissions = cartItems.reduce((acc, ci) => acc + (ci.commission_amount_cop || 0), 0);

    const saleNumber = `TKT-${new Date().getFullYear()}-${(sales.length + 1).toString().padStart(4, '0')}`;

    const newSale: PosSale = {
      id: 'sale-' + Date.now(),
      shift_id: activeShift.id,
      tenant_id: activeShift.tenant_id,
      sale_number: saleNumber,
      client_id: selectedClient?.id,
      client_name: selectedClient?.full_name || 'Cliente Mostrador / Ocasional',
      client_phone: selectedClient?.phone_whatsapp || '',
      items: [...cartItems],
      subtotal_cop: cartSubtotal,
      discount_amount_cop: computedDiscount,
      deposit_deducted_cop: depositDeduction,
      tip_amount_cop: tipVal,
      total_cop: cartTotalToPay,
      payment_method: paymentMethod,
      payment_breakdown: paymentMethod === 'mixto' ? {
        cash_cop: mixedCash,
        nequi_daviplata_cop: mixedDigital
      } : {
        cash_cop: paymentMethod === 'efectivo' ? cartTotalToPay : 0,
        card_cop: paymentMethod === 'tarjeta' ? cartTotalToPay : 0,
        nequi_daviplata_cop: (paymentMethod === 'nequi' || paymentMethod === 'daviplata') ? cartTotalToPay : 0,
        transfer_cop: paymentMethod === 'transferencia' ? cartTotalToPay : 0
      },
      cash_received_cop: paymentMethod === 'efectivo' ? cashReceived : cartTotalToPay,
      change_returned_cop: changeDue,
      total_commissions_cop: totalCommissions,
      receipt_sent_wa: false,
      notes: saleNotes,
      created_at: new Date().toISOString()
    };

    setSales([newSale, ...sales]);
    setLastCompletedSale(newSale);
    setIsCheckoutOpen(false);

    // Resetear carrito
    setCartItems([]);
    setSelectedClient(null);
    setDiscountVal(0);
    setTipVal(0);
    setDepositDeduction(0);
    setSaleNotes('');
  };

  // ---------------------------------------------------------------------------
  // HANDLERS: APERTURA & CIERRE DE CAJA
  // ---------------------------------------------------------------------------
  const handleOpenShift = (e: React.FormEvent) => {
    e.preventDefault();
    const newShift: CashShift = {
      id: 'shift-' + Date.now().toString().slice(-6),
      tenant_id: '00000000-0000-0000-0000-000000000001',
      opened_by_name: openResponsible || ownerName,
      opened_at: new Date().toISOString(),
      initial_amount_cop: Number(openBaseCash) || 0,
      opening_notes: openNotes,
      status: 'open',
      total_sales_cop: 0,
      total_cash_sales_cop: 0,
      total_card_sales_cop: 0,
      total_digital_sales_cop: 0,
      total_expenses_cop: 0,
      total_incomes_cop: 0,
      total_commissions_cop: 0
    };
    setActiveShift(newShift);
    setIsOpeningModalOpen(false);
  };

  const handleCloseShift = () => {
    if (!activeShift) return;

    const closedShift: CashShift = {
      ...activeShift,
      status: 'closed',
      closed_by_name: ownerName || 'Tulio Páez',
      closed_at: new Date().toISOString(),
      closing_notes: closingNotes,
      expected_cash_cop: expectedCashInDrawer,
      actual_cash_cop: countedCash,
      difference_cash_cop: cashDifference,
      total_sales_cop: totalTurnover,
      total_cash_sales_cop: totalSalesCash,
      total_card_sales_cop: totalSalesCard,
      total_digital_sales_cop: totalSalesDigital,
      total_expenses_cop: totalExpensesCash,
      total_incomes_cop: totalIncomesCash,
      total_commissions_cop: totalCommissionsEarned
    };

    setShiftsHistory([closedShift, ...shiftsHistory]);
    setActiveShift(null);
    setShowZReportModal(closedShift);
    setPosTab('history');
  };

  // ---------------------------------------------------------------------------
  // HANDLERS: MOVIMIENTOS DE CAJA CHICA
  // ---------------------------------------------------------------------------
  const handleAddMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift || movAmount <= 0 || !movDesc.trim()) return;

    const newMov: CashMovement = {
      id: 'mov-' + Date.now(),
      shift_id: activeShift.id,
      tenant_id: activeShift.tenant_id,
      type: movType,
      category: movCategory,
      amount_cop: Number(movAmount),
      description: movDesc.trim(),
      created_by_name: ownerName || 'Tulio Páez',
      created_at: new Date().toISOString()
    };

    setMovements([newMov, ...movements]);
    setIsMovementModalOpen(false);
    setMovAmount(0);
    setMovDesc('');
  };

  // ---------------------------------------------------------------------------
  // FILTRADO DEL CATÁLOGO (Servicios + Productos)
  // ---------------------------------------------------------------------------
  const catalogList = useMemo(() => {
    let list: Array<{ item: Service | Product; type: 'service' | 'retail' }> = [];

    if (catalogCategory === 'all' || catalogCategory === 'services') {
      services.forEach(s => list.push({ item: s, type: 'service' }));
    }
    if (catalogCategory === 'all' || catalogCategory === 'retail') {
      products.forEach(p => list.push({ item: p, type: 'retail' }));
    }
    if (catalogCategory !== 'all' && catalogCategory !== 'services' && catalogCategory !== 'retail') {
      services.filter(s => s.category === catalogCategory).forEach(s => list.push({ item: s, type: 'service' }));
    }

    if (catalogSearch.trim()) {
      const q = catalogSearch.toLowerCase();
      list = list.filter(l => l.item.name.toLowerCase().includes(q));
    }

    return list;
  }, [services, products, catalogCategory, catalogSearch]);

  return (
    <div className="space-y-6">
      {/* =====================================================================
          1. HEADER ULTRA-COMPACTO: ESTADO DE CAJA & NAVEGACIÓN
          ===================================================================== */}
      <div className={`p-4 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all shadow-sm ${
        isDark ? 'bg-[#141926] border-white/10' : 'bg-white border-slate-200'
      }`}>
        {/* Lado Izquierdo: Volver + Estado de Turno */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToOverview}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isDark ? 'bg-[#1A2133] border-white/10 text-white hover:border-[#FF5A36]' : 'bg-[#F0F2F7] border-black/5 text-slate-800 hover:border-[#FF5A36]'
            }`}
            title="Volver a Overview"
          >
            <ArrowDownLeft className="w-4 h-4 rotate-45" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          <div className="h-6 w-px bg-slate-700/30 dark:bg-white/10" />

          {activeShift ? (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-extrabold text-emerald-400">Caja Abierta</strong>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                    Turno #{activeShift.id.slice(-4)}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Base: <strong className="text-white">${activeShift.initial_amount_cop.toLocaleString()} {salonCurrency}</strong> • Ventas: <strong className="text-emerald-400">${totalTurnover.toLocaleString()}</strong>
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <div>
                <strong className="text-sm font-extrabold text-red-400 block">Caja Cerrada</strong>
                <span className="text-[11px] text-slate-400">Inicia turno para habilitar la terminal de cobro</span>
              </div>
            </div>
          )}
        </div>

        {/* Lado Central: Selector de Pestañas del POS */}
        <div className={`flex items-center p-1 rounded-xl border self-center overflow-x-auto ${
          isDark ? 'bg-[#0E121B] border-white/5' : 'bg-slate-100 border-slate-200'
        }`}>
          {[
            { id: 'terminal', label: 'Terminal POS', icon: CreditCard },
            { id: 'movements', label: `Movimientos (${currentShiftMovements.length})`, icon: TrendingDown },
            { id: 'commissions', label: `Comisiones Equipo ($${totalPendingCommissionsDetailed.toLocaleString()})`, icon: Scissors },
            { id: 'closing', label: 'Arqueo & Cierre', icon: Lock },
            { id: 'history', label: 'Historial Turnos', icon: History }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = posTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPosTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF5A36] text-white shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Lado Derecho: Acciones Rápidas */}
        <div className="flex items-center gap-2 justify-end">
          {activeShift ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setMovType('expense');
                  setIsMovementModalOpen(true);
                }}
                className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                <span>- Gasto Menor</span>
              </button>

              <button
                type="button"
                onClick={() => setPosTab('closing')}
                className="bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-red-500/20 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Cerrar Caja</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsOpeningModalOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Abrir Turno de Caja</span>
            </button>
          )}
        </div>
      </div>

      {/* =====================================================================
          2. VISTA 1: TERMINAL DE VENTAS & CHECKOUT POS
          ===================================================================== */}
      {posTab === 'terminal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda: Catálogo de Servicios & Retail (7 cols) */}
          <div className={`lg:col-span-7 rounded-2xl p-5 border space-y-4 ${
            isDark ? 'bg-[#141926] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            {/* Header del Catálogo con Buscador */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF5A36]" />
                    Catálogo de Servicios & Productos Retail
                  </h3>
                  <span className="text-[11px] text-slate-400">Haz clic en un ítem para agregarlo al ticket</span>
                </div>

                {/* Buscador */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs w-full sm:w-60 ${
                  isDark ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Buscar corte, balayage, shampoo..."
                    className="w-full bg-transparent text-xs focus:outline-none placeholder:text-slate-500"
                  />
                  {catalogSearch && (
                    <button type="button" onClick={() => setCatalogSearch('')} className="text-slate-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Categorías Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: '✨ Todo' },
                  { id: 'services', label: '💇‍♀️ Todos Servicios' },
                  { id: 'retail', label: '🛍️ Productos Retail' },
                  { id: 'color', label: '🎨 Colorimetría' },
                  { id: 'corte', label: '✂️ Cortes' },
                  { id: 'keratina', label: '✨ Alisados' },
                  { id: 'nails', label: '💅 Uñas' },
                  { id: 'spa', label: '💆‍♀️ Spa' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCatalogCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      catalogCategory === cat.id
                        ? 'bg-[#FF5A36] border-[#FF5A36] text-white'
                        : isDark
                          ? 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300'
                          : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Ítems del Catálogo */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[560px] overflow-y-auto pr-1">
              {catalogList.map(({ item, type }, idx) => {
                const price = type === 'service' ? ((item as Service).price_usd || 45000) : ((item as Product).price_usd || 32000);
                const isService = type === 'service';

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddItemToCart(item, type)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${
                      isDark
                        ? 'bg-[#1A2133] border-white/5 hover:border-[#FF5A36] hover:bg-[#1f283d]'
                        : 'bg-slate-50 border-slate-200 hover:border-[#FF5A36] hover:bg-orange-50/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          isService ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {isService ? 'Servicio' : 'Retail'}
                        </span>
                        {isService && (
                          <span className="text-[10px] text-slate-400">
                            {(item as Service).duration_minutes || 45}m
                          </span>
                        )}
                      </div>
                      <strong className="text-xs font-bold block line-clamp-2 leading-tight group-hover:text-[#FF5A36] transition-colors">
                        {item.name}
                      </strong>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-[#FF5A36]">
                        ${price.toLocaleString()} <span className="text-[10px] font-normal opacity-70">{salonCurrency}</span>
                      </span>
                      <div className="w-6 h-6 rounded-lg bg-[#FF5A36]/10 text-[#FF5A36] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha: Ticket de Venta & Cobro (5 cols) */}
          <div className={`lg:col-span-5 rounded-2xl p-5 border flex flex-col justify-between space-y-4 ${
            isDark ? 'bg-[#141926] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="space-y-4">
              {/* Header del Ticket + Selector de Cliente */}
              <div className="flex items-center justify-between border-b pb-3 border-black/5 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#FF5A36]" />
                  <h3 className="text-sm font-bold">Ticket de Venta</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsExtraChargeModalOpen(true)}
                    className="text-[11px] text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold transition-all cursor-pointer shadow-sm"
                    title="Agregar recargo por longitud, retiro de uñas, etc."
                  >
                    <Zap className="w-3 h-3" /> + Cobro Extra
                  </button>
                  {cartItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCartItems([])}
                      className="text-[11px] text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Vaciar
                    </button>
                  )}
                </div>
              </div>

              {/* Asignación de Cliente */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Cliente de la Venta:
                </label>
                <div className="flex items-center gap-2">
                  <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${
                    isDark ? 'bg-[#0E121B] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <select
                      value={selectedClient?.id || ''}
                      onChange={(e) => {
                        const cl = clients.find(c => c.id === e.target.value);
                        setSelectedClient(cl || null);
                      }}
                      className="w-full bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value="" className={isDark ? 'bg-[#0E121B] text-white' : 'bg-white text-slate-900'}>
                        👤 Cliente Ocasional / Mostrador
                      </option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id} className={isDark ? 'bg-[#0E121B] text-white' : 'bg-white text-slate-900'}>
                          {c.full_name} ({c.phone_whatsapp || 'Sin WhatsApp'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Lista de Ítems en el Carrito */}
              <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {cartItems.length === 0 ? (
                  <div className={`p-8 rounded-xl border border-dashed text-center space-y-2 ${
                    isDark ? 'border-white/10 bg-[#0E121B]/40' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <ShoppingBag className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
                    <p className="text-xs text-slate-400">El ticket está vacío.</p>
                    <span className="text-[11px] text-slate-500 block">Haz clic en servicios o productos del catálogo para agregarlos.</span>
                  </div>
                ) : (
                  cartItems.map((ci) => (
                    <div
                      key={ci.id}
                      className={`p-3 rounded-xl border space-y-2 ${
                        isDark ? 'bg-[#0E121B] border-white/5' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            {ci.name.startsWith('⚡') && (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400">
                                Recargo
                              </span>
                            )}
                            <strong className="text-xs block truncate">{ci.name}</strong>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            ${ci.unit_price_cop.toLocaleString()} c/u
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-[#FF5A36]">
                            ${ci.total_cop.toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCartItem(ci.id)}
                            className="text-slate-400 hover:text-red-400 p-0.5 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Selector de Especialista + Cantidad */}
                      <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-black/5 dark:border-white/5 text-[11px]">
                        {/* Selector de Estilista */}
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <Scissors className="w-3 h-3 text-[#FF5A36] shrink-0" />
                          <select
                            value={ci.stylist_name || ''}
                            onChange={(e) => handleUpdateItemStylist(ci.id, e.target.value)}
                            className={`bg-transparent text-[11px] font-semibold border-b focus:outline-none truncate w-full cursor-pointer ${
                              isDark ? 'border-white/10 text-slate-300' : 'border-slate-300 text-slate-700'
                            }`}
                          >
                            {stylists.map(st => (
                              <option key={st.id} value={st.name} className={isDark ? 'bg-[#0E121B]' : 'bg-white'}>
                                {st.name} ({ci.type === 'service' ? st.commission_service_pct : st.commission_retail_pct}%)
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Control de Cantidad */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(ci.id, -1)}
                            className="w-5 h-5 rounded border border-slate-700 flex items-center justify-center text-xs hover:bg-white/10"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-bold text-xs">{ci.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(ci.id, 1)}
                            className="w-5 h-5 rounded border border-slate-700 flex items-center justify-center text-xs hover:bg-white/10"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Ajustes de Descuentos & Anticipos */}
              {cartItems.length > 0 && (
                <div className={`p-3 rounded-xl border space-y-2 text-xs ${
                  isDark ? 'bg-[#0E121B]/60 border-white/5' : 'bg-slate-100/70 border-slate-200'
                }`}>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Descuento ({discountType === 'percent' ? '%' : '$ COP'}):</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          value={discountVal || ''}
                          onChange={(e) => setDiscountVal(Number(e.target.value) || 0)}
                          placeholder="0"
                          className={`w-full px-2 py-1 rounded-lg border text-xs focus:outline-none ${
                            isDark ? 'bg-[#141926] border-white/10 text-white' : 'bg-white border-slate-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setDiscountType(discountType === 'percent' ? 'fixed' : 'percent')}
                          className="px-2 py-1 rounded-lg border text-[10px] font-bold border-white/10 bg-white/5"
                        >
                          {discountType === 'percent' ? '%' : '$'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Deducir Anticipo ($):</label>
                      <input
                        type="number"
                        min={0}
                        value={depositDeduction || ''}
                        onChange={(e) => setDepositDeduction(Number(e.target.value) || 0)}
                        placeholder="0"
                        className={`w-full px-2 py-1 rounded-lg border text-xs focus:outline-none ${
                          isDark ? 'bg-[#141926] border-white/10 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Totales y Botón de Cobro */}
            <div className="space-y-3 pt-3 border-t border-black/5 dark:border-white/10">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${cartSubtotal.toLocaleString()} {salonCurrency}</span>
                </div>
                {computedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Descuento:</span>
                    <span>-${computedDiscount.toLocaleString()} {salonCurrency}</span>
                  </div>
                )}
                {depositDeduction > 0 && (
                  <div className="flex justify-between text-blue-400 font-semibold">
                    <span>Anticipo Abonado:</span>
                    <span>-${depositDeduction.toLocaleString()} {salonCurrency}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-base pt-2 border-t border-black/5 dark:border-white/10 text-slate-900 dark:text-white">
                  <span>Total a Cobrar:</span>
                  <span className="text-[#FF5A36] text-xl">${cartTotalToPay.toLocaleString()} {salonCurrency}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenCheckout}
                disabled={cartItems.length === 0}
                className="w-full bg-gradient-to-r from-[#FF5A36] to-[#E54E07] hover:opacity-95 disabled:opacity-40 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A36]/30 text-sm transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Proceder al Cobro (${cartTotalToPay.toLocaleString()})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. VISTA 2: MOVIMIENTOS DE CAJA CHICA (GASTOS & ENTRADAS)
          ===================================================================== */}
      {posTab === 'movements' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-[#141926] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-black/5 dark:border-white/10">
            <div>
              <h3 className="text-base font-bold">Movimientos de Caja Chica</h3>
              <p className="text-xs text-slate-400">Registra gastos menores o ingresos adicionales en efectivo durante el turno.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsMovementModalOpen(true)}
              className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Movimiento</span>
            </button>
          </div>

          {/* Resumen de Movimientos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${
              isDark ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50 border-red-100'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold block">Gastos / Salidas en Efectivo</span>
                <strong className="text-lg font-extrabold text-red-400">-${totalExpensesCash.toLocaleString()} {salonCurrency}</strong>
              </div>
            </div>

            <div className={`p-4 rounded-xl border flex items-center gap-3 ${
              isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold block">Ingresos Extra en Efectivo</span>
                <strong className="text-lg font-extrabold text-emerald-400">+${totalIncomesCash.toLocaleString()} {salonCurrency}</strong>
              </div>
            </div>
          </div>

          {/* Tabla de Movimientos */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="pb-2">Hora</th>
                  <th className="pb-2">Tipo</th>
                  <th className="pb-2">Categoría</th>
                  <th className="pb-2">Descripción</th>
                  <th className="pb-2">Responsable</th>
                  <th className="pb-2 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {currentShiftMovements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No hay movimientos registrados en este turno de caja.
                    </td>
                  </tr>
                ) : (
                  currentShiftMovements.map(m => (
                    <tr key={m.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 text-slate-400">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.type === 'expense' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {m.type === 'expense' ? 'Egreso' : 'Ingreso'}
                        </span>
                      </td>
                      <td className="py-3 capitalize text-slate-300">{m.category}</td>
                      <td className="py-3">{m.description}</td>
                      <td className="py-3 font-medium text-slate-400">{m.created_by_name}</td>
                      <td className={`py-3 text-right font-bold ${m.type === 'expense' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {m.type === 'expense' ? '-' : '+'}${m.amount_cop.toLocaleString()} {salonCurrency}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. VISTA: TABLA Y LIQUIDACIÓN DE COMISIONES DE ESPECIALISTAS
          ===================================================================== */}
      {posTab === 'commissions' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-[#141926] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          {/* Header & Filtros */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-black/5 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Liquidación y Reporte de Comisiones del Equipo</h3>
                  <p className="text-xs text-slate-400">Control de producción individual, servicios, retail y pagos acumulados.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Selector de Rango */}
              <div className={`flex items-center p-1 rounded-xl border text-xs ${
                isDark ? 'bg-[#0E121B] border-white/10' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={() => setCommissionsTimeRange('current_shift')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    commissionsTimeRange === 'current_shift'
                      ? 'bg-[#FF5A36] text-white'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🟢 Turno Actual (En Vivo)
                </button>
                <button
                  type="button"
                  onClick={() => setCommissionsTimeRange('all_time')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    commissionsTimeRange === 'all_time'
                      ? 'bg-[#FF5A36] text-white'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🌐 Todo el Historial
                </button>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className={`p-2 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
                title="Imprimir Planilla de Liquidación"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Planilla</span>
              </button>
            </div>
          </div>

          {/* 4 KPIs de Comisiones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border space-y-1 ${
              isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-100'
            }`}>
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Total Pendiente por Pagar</span>
              <strong className="text-xl font-extrabold text-amber-400">
                ${totalPendingCommissionsDetailed.toLocaleString()} {salonCurrency}
              </strong>
              <span className="text-[10px] text-slate-400 block">Saldo por liquidar al equipo</span>
            </div>

            <div className={`p-4 rounded-xl border space-y-1 ${
              isDark ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-100'
            }`}>
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Facturación Bruta Generada</span>
              <strong className="text-xl font-extrabold text-blue-400">
                ${totalGrossDetailed.toLocaleString()} {salonCurrency}
              </strong>
              <span className="text-[10px] text-slate-400 block">Total en servicios y retail atendidos</span>
            </div>

            <div className={`p-4 rounded-xl border space-y-1 ${
              isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'
            }`}>
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Comisiones ya Pagadas</span>
              <strong className="text-xl font-extrabold text-emerald-400">
                ${totalCommissionsPaidDetailed.toLocaleString()} {salonCurrency}
              </strong>
              <span className="text-[10px] text-slate-400 block">Efectivo entregado a estilistas</span>
            </div>

            <div className={`p-4 rounded-xl border space-y-1 ${
              isDark ? 'bg-purple-500/5 border-purple-500/20' : 'bg-purple-50 border-purple-100'
            }`}>
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Margen Neto para el Salón</span>
              <strong className="text-xl font-extrabold text-[#FF5A36]">
                ${(totalGrossDetailed - totalCommissionsEarnedDetailed).toLocaleString()} {salonCurrency}
              </strong>
              <span className="text-[10px] text-slate-400 block">Ganancia neta tras comisiones</span>
            </div>
          </div>

          {/* Tabla Maestra de Comisiones por Especialista */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="pb-3">Especialista</th>
                  <th className="pb-3">Esquema %</th>
                  <th className="pb-3">Servicios Atendidos</th>
                  <th className="pb-3">Retail Vendido</th>
                  <th className="pb-3">Comisión Ganada</th>
                  <th className="pb-3">PENDIENTE A PAGAR</th>
                  <th className="pb-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {detailedStylistCommissions.map(d => (
                  <tr key={d.stylist.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={d.stylist.photo_url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop`}
                          alt={d.stylist.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#FF5A36]/30"
                        />
                        <div>
                          <strong className="block font-bold text-slate-200 text-xs">{d.stylist.name}</strong>
                          <span className="text-[10px] text-slate-400">{d.stylist.specialty || 'Estilista'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-300">
                      <div className="text-[11px] space-y-0.5">
                        <div>💇‍♀️ <strong className="text-purple-400">{d.stylist.commission_service_pct}%</strong> Serv.</div>
                        <div>🛍️ <strong className="text-emerald-400">{d.stylist.commission_retail_pct}%</strong> Ret.</div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div>
                        <strong className="text-xs font-semibold">{d.servicesCount} servicios</strong>
                        <span className="text-[10px] text-slate-400 block">${d.grossServicesCop.toLocaleString()} {salonCurrency}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div>
                        <strong className="text-xs font-semibold">{d.retailCount} productos</strong>
                        <span className="text-[10px] text-slate-400 block">${d.grossRetailCop.toLocaleString()} {salonCurrency}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div>
                        <strong className="text-xs font-bold text-slate-200">
                          ${d.totalCommCop.toLocaleString()} {salonCurrency}
                        </strong>
                        {d.commPaidCop > 0 && (
                          <span className="text-[10px] text-emerald-400 block">
                            (Pagado: ${d.commPaidCop.toLocaleString()})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5">
                      {d.pendingCommCop === 0 ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <div>
                            <strong className="text-xs font-bold text-emerald-400">$0 COP</strong>
                            <span className="text-[9px] text-emerald-400 block font-bold uppercase">Liquidado</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl inline-block">
                          <strong className="text-sm font-extrabold text-amber-400">
                            ${d.pendingCommCop.toLocaleString()}
                          </strong>
                          <span className="text-[9px] text-slate-400 block uppercase font-bold">Por pagar {salonCurrency}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedStylistDetail({
                            stylistName: d.stylist.name,
                            stylistSpecialty: d.stylist.specialty || 'Estilista',
                            stylistCommissionServicePct: d.stylist.commission_service_pct,
                            stylistCommissionRetailPct: d.stylist.commission_retail_pct,
                            servicesCount: d.servicesCount,
                            grossServicesCop: d.grossServicesCop,
                            commServicesCop: d.commServicesCop,
                            retailCount: d.retailCount,
                            grossRetailCop: d.grossRetailCop,
                            commRetailCop: d.commRetailCop,
                            totalCommCop: d.totalCommCop,
                            commPaidCop: d.commPaidCop,
                            pendingCommCop: d.pendingCommCop,
                            totalGrossCop: d.totalGrossCop,
                            items: d.items
                          })}
                          className={`p-1.5 px-2.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                            isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                          }`}
                          title="Ver desglose detallado de tickets"
                        >
                          <Receipt className="w-3 h-3 text-[#FF5A36]" />
                          <span>Tickets ({d.items.length})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSendStylistWhatsApp(
                            d.stylist.name,
                            d.stylist.phone || d.stylist.phone_whatsapp || '',
                            d.totalCommCop,
                            d.totalGrossCop,
                            d.servicesCount
                          )}
                          className="p-1.5 px-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          title="Enviar reporte por WhatsApp al especialista"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span className="hidden xl:inline">WhatsApp</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePayStylistCommission(d.stylist.name, d.pendingCommCop)}
                          disabled={d.pendingCommCop <= 0}
                          className={`p-1.5 px-2.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                            d.pendingCommCop <= 0
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default opacity-80'
                              : 'bg-gradient-to-r from-[#FF5A36] to-[#E54E07] text-white shadow-sm shadow-[#FF5A36]/20 cursor-pointer'
                          }`}
                          title={d.pendingCommCop <= 0 ? 'Comisión al día' : 'Pagar comisión pendiente'}
                        >
                          {d.pendingCommCop <= 0 ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Al Día</span>
                            </>
                          ) : (
                            <>
                              <DollarSign className="w-3 h-3" />
                              <span>Pagar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. VISTA 3: ARQUEO & CIERRE DE CAJA EN VIVO
          ===================================================================== */}
      {posTab === 'closing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda: Calculadora de Arqueo (7 cols) */}
          <div className={`lg:col-span-7 rounded-2xl p-6 border space-y-6 ${
            isDark ? 'bg-[#141926] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="border-b pb-3 border-black/5 dark:border-white/10">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-400" />
                Arqueo & Cierre de Turno
              </h3>
              <p className="text-xs text-slate-400">Verifica el efectivo físico contado vs. el saldo teórico del sistema.</p>
            </div>

            {/* Desglose de Ventas por Canal de Pago */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#0E121B] border-white/5' : 'bg-slate-50'}`}>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">💵 Efectivo Ventas</span>
                <strong className="text-sm font-extrabold text-emerald-400">${totalSalesCash.toLocaleString()}</strong>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#0E121B] border-white/5' : 'bg-slate-50'}`}>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">📱 Nequi / Digital</span>
                <strong className="text-sm font-extrabold text-purple-400">${totalSalesDigital.toLocaleString()}</strong>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#0E121B] border-white/5' : 'bg-slate-50'}`}>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">💳 Datáfono / Tarjetas</span>
                <strong className="text-sm font-extrabold text-blue-400">${totalSalesCard.toLocaleString()}</strong>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#0E121B] border-white/5' : 'bg-slate-50'}`}>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">🎯 Total Facturado</span>
                <strong className="text-sm font-extrabold text-[#FF5A36]">${totalTurnover.toLocaleString()}</strong>
              </div>
            </div>

            {/* Ecuación de Arqueo */}
            <div className={`p-4 rounded-xl border space-y-3 text-xs ${
              isDark ? 'bg-[#0E121B] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex justify-between">
                <span>(+) Base Inicial de Caja:</span>
                <strong className="text-white">${activeShift?.initial_amount_cop.toLocaleString() || 0} {salonCurrency}</strong>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>(+) Total Ventas en Efectivo:</span>
                <strong>+${totalSalesCash.toLocaleString()} {salonCurrency}</strong>
              </div>
              {totalIncomesCash > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>(+) Ingresos Extra en Efectivo:</span>
                  <strong>+${totalIncomesCash.toLocaleString()} {salonCurrency}</strong>
                </div>
              )}
              {totalExpensesCash > 0 && (
                <div className="flex justify-between text-red-400">
                  <span>(-) Gastos / Salidas en Efectivo:</span>
                  <strong>-${totalExpensesCash.toLocaleString()} {salonCurrency}</strong>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-sm pt-2 border-t border-black/10 dark:border-white/10">
                <span>(=) Efectivo Teórico Esperado en Caja:</span>
                <span className="text-emerald-400 font-mono">${expectedCashInDrawer.toLocaleString()} {salonCurrency}</span>
              </div>
            </div>

            {/* Formulario de Conteo Físico */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                Digita el Efectivo Real Contado en el Cajón:
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  value={countedCash || ''}
                  onChange={(e) => setCountedCash(Number(e.target.value) || 0)}
                  placeholder="0"
                  className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-base font-extrabold focus:outline-none focus:border-[#FF5A36] ${
                    isDark ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-white border-slate-300'
                  }`}
                />
              </div>

              {/* Resultado del Cuadre */}
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                cashDifference === 0
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : cashDifference > 0
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                <div className="flex items-center gap-2">
                  {cashDifference === 0 ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  <div>
                    <strong className="text-xs block">
                      {cashDifference === 0
                        ? '✅ Cuadre de Caja Perfecto'
                        : cashDifference > 0
                          ? `🔵 Sobrante en Caja (+${cashDifference.toLocaleString()} ${salonCurrency})`
                          : `🔴 Faltante en Caja (${cashDifference.toLocaleString()} ${salonCurrency})`}
                    </strong>
                    <span className="text-[10px] opacity-80">
                      Teórico: ${expectedCashInDrawer.toLocaleString()} vs. Contado: ${countedCash.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notas de Cierre */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Notas u Observaciones de Cierre:</label>
                <textarea
                  rows={2}
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  placeholder="Ej: Turno cerrado sin novedades, se entregó base completa a administración..."
                  className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A36] ${
                    isDark ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-white border-slate-300'
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={handleCloseShift}
                disabled={!activeShift}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-red-500/20 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Ejecutar Cierre Oficial de Turno & Generar Reporte Z</span>
              </button>
            </div>
          </div>

          {/* Columna Derecha: Liquidación de Comisiones del Turno (5 cols) */}
          <div className={`lg:col-span-5 rounded-2xl p-6 border space-y-4 ${
            isDark ? 'bg-[#141926] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="border-b pb-3 border-black/5 dark:border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#FF5A36] uppercase flex items-center gap-1.5">
                <Scissors className="w-4 h-4" />
                Liquidación de Comisiones
              </h3>
              <span className="text-xs font-extrabold text-emerald-400">
                ${totalCommissionsEarned.toLocaleString()}
              </span>
            </div>

            <div className="space-y-3">
              {Object.keys(commissionsByStylist).length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No se han generado comisiones aún en este turno.
                </div>
              ) : (
                Object.entries(commissionsByStylist).map(([stName, data], idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border space-y-1.5 text-xs ${
                      isDark ? 'bg-[#0E121B] border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <strong className="text-white font-bold">{stName}</strong>
                      <span className="font-extrabold text-emerald-400">${data.totalCop.toLocaleString()} {salonCurrency}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Servicios: ${data.servicesCop.toLocaleString()}</span>
                      <span>Retail: ${data.retailCop.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Resumen Final de Turno */}
            <div className={`p-4 rounded-xl border space-y-2 text-xs ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
            }`}>
              <div className="flex justify-between">
                <span>Ventas Totales Brutas:</span>
                <strong>${totalTurnover.toLocaleString()} {salonCurrency}</strong>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Comisiones a Pagar Equipo:</span>
                <strong>-${totalCommissionsEarned.toLocaleString()} {salonCurrency}</strong>
              </div>
              <div className="flex justify-between font-extrabold text-sm pt-2 border-t border-black/10 dark:border-white/10 text-white">
                <span>Margen Neto para el Salón:</span>
                <span className="text-[#FF5A36]">${(totalTurnover - totalCommissionsEarned).toLocaleString()} {salonCurrency}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. VISTA 4: HISTORIAL DE CIERRES DE CAJA
          ===================================================================== */}
      {posTab === 'history' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-[#141926] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="border-b pb-3 border-black/5 dark:border-white/10">
            <h3 className="text-base font-bold flex items-center gap-2">
              <History className="w-4 h-4 text-[#FF5A36]" />
              Historial de Turnos y Cierres de Caja
            </h3>
            <p className="text-xs text-slate-400">Auditoría completa de todas las aperturas y cierres registrados.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="pb-2">Turno</th>
                  <th className="pb-2">Apertura</th>
                  <th className="pb-2">Cierre</th>
                  <th className="pb-2">Responsable</th>
                  <th className="pb-2">Base Inicial</th>
                  <th className="pb-2">Total Ventas</th>
                  <th className="pb-2">Efectivo Contado</th>
                  <th className="pb-2">Diferencia</th>
                  <th className="pb-2 text-right">Reporte</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {shiftsHistory.map(sh => (
                  <tr key={sh.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono font-bold text-[#FF5A36]">#{sh.id.slice(-6)}</td>
                    <td className="py-3 text-slate-400">{new Date(sh.opened_at).toLocaleDateString()} {new Date(sh.opened_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-3 text-slate-400">{sh.closed_at ? new Date(sh.closed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Abierto'}</td>
                    <td className="py-3 font-semibold">{sh.closed_by_name || sh.opened_by_name}</td>
                    <td className="py-3">${sh.initial_amount_cop.toLocaleString()}</td>
                    <td className="py-3 font-bold text-emerald-400">${(sh.total_sales_cop || 0).toLocaleString()}</td>
                    <td className="py-3 font-bold">${(sh.actual_cash_cop || 0).toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        (sh.difference_cash_cop || 0) === 0
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : (sh.difference_cash_cop || 0) > 0
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}>
                        {(sh.difference_cash_cop || 0) >= 0 ? `+${sh.difference_cash_cop}` : sh.difference_cash_cop}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setShowZReportModal(sh)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Ver Z</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 1: APERTURA DE TURNO DE CAJA (LUXURY GLASSMORPHIC)
          ===================================================================== */}
      {isOpeningModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`w-full max-w-md p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative overflow-hidden ${
            isDark ? 'bg-[#121624]/95 border-white/15 text-white shadow-black/80' : 'bg-white/95 border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-4 border-black/5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black shadow-lg shadow-emerald-500/25">
                  <Unlock className="w-5 h-5 font-black" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight">Apertura de Turno de Caja</h3>
                  <span className="text-xs text-slate-400">Inicia el cuadre de efectivo para cobrar</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpeningModalOpen(false)}
                className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleOpenShift} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-slate-300 block text-xs">Base Inicial en Efectivo ($ COP):</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-black text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min={0}
                    value={openBaseCash}
                    onChange={(e) => setOpenBaseCash(Number(e.target.value) || 0)}
                    required
                    className={`w-full pl-8 pr-3 py-2.5 rounded-xl border text-base font-black focus:outline-none focus:border-emerald-500 ${
                      isDark ? 'bg-[#141926] border-white/15 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
                {/* Presets rápidos */}
                <div className="flex items-center gap-1.5 pt-1">
                  {[50000, 100000, 150000, 200000].map(base => (
                    <button
                      key={base}
                      type="button"
                      onClick={() => setOpenBaseCash(base)}
                      className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${
                        openBaseCash === base
                          ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold'
                          : 'bg-white/5 border-white/10 hover:bg-white/15 text-slate-400'
                      }`}
                    >
                      ${base / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Cajero / Responsable del Turno:</label>
                <input
                  type="text"
                  value={openResponsible}
                  onChange={(e) => setOpenResponsible(e.target.value)}
                  required
                  placeholder="Nombre de quien recibe la caja"
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-emerald-500 ${
                    isDark ? 'bg-[#141926] border-white/10 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Notas u Observaciones:</label>
                <textarea
                  rows={2}
                  value={openNotes}
                  onChange={(e) => setOpenNotes(e.target.value)}
                  placeholder="Ej: Billetes en baja denominación para dar cambio..."
                  className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:border-emerald-500 ${
                    isDark ? 'bg-[#141926] border-white/10 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsOpeningModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-black font-black flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/25 cursor-pointer transition-all"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Habilitar Turno de Caja</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: REGISTRAR MOVIMIENTO (GASTO / ENTRADA LUXURY)
          ===================================================================== */}
      {isMovementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`w-full max-w-md p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 relative overflow-hidden ${
            isDark ? 'bg-[#121624]/95 border-white/15 text-white shadow-black/80' : 'bg-white/95 border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-4 border-black/5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                  movType === 'expense'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {movType === 'expense' ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight">Movimiento de Caja Chica</h3>
                  <span className="text-xs text-slate-400">Registra entradas o salidas del cajón</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMovementModalOpen(false)}
                className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMovement} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMovType('expense')}
                  className={`py-2.5 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                    movType === 'expense'
                      ? 'bg-red-500/20 border-red-500 text-red-400 shadow-sm'
                      : 'border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  🔴 Salida / Gasto (-)
                </button>
                <button
                  type="button"
                  onClick={() => setMovType('income')}
                  className={`py-2.5 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                    movType === 'income'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm'
                      : 'border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  🟢 Ingreso Extra (+)
                </button>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Monto en Efectivo ($ COP):</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2 font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    min={1}
                    value={movAmount || ''}
                    onChange={(e) => setMovAmount(Number(e.target.value) || 0)}
                    required
                    placeholder="0"
                    className={`w-full pl-8 pr-3 py-2 rounded-xl border text-sm font-black focus:outline-none focus:border-[#FF5A36] ${
                      isDark ? 'bg-[#141926] border-white/15 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Categoría:</label>
                <select
                  value={movCategory}
                  onChange={(e) => setMovCategory(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                    isDark ? 'bg-[#141926] border-white/10 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  <option value="insumos">🧴 Insumos / Tintes / Urgencias</option>
                  <option value="cafe_alimentos">☕ Café / Snacks para Clientas</option>
                  <option value="servicios">💡 Servicios Públicos / Mantenimiento</option>
                  <option value="domicilios">🛵 Domicilios / Mensajería</option>
                  <option value="propinas">💰 Retiro de Propinas</option>
                  <option value="otro">📌 Otro Concepto</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Descripción / Concepto:</label>
                <input
                  type="text"
                  value={movDesc}
                  onChange={(e) => setMovDesc(e.target.value)}
                  required
                  placeholder="Ej: Compra de agua y café para recepción..."
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A36] ${
                    isDark ? 'bg-[#141926] border-white/10 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#E54E07] text-white font-black flex items-center justify-center gap-1.5 shadow-lg shadow-[#FF5A36]/25 cursor-pointer hover:opacity-95 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Movimiento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: CHECKOUT MULTI-MÉTODO DE PAGO ULTRA-PREMIUM
          ===================================================================== */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className={`w-full max-w-xl p-5 sm:p-7 rounded-3xl border shadow-2xl space-y-4 sm:space-y-5 animate-in zoom-in-95 duration-200 relative max-h-[92vh] overflow-y-auto ${
            isDark 
              ? 'bg-[#121624]/95 border-white/15 text-white shadow-black/80' 
              : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
          }`}>
            {/* Glow decorativo de fondo */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FF5A36]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header del Modal */}
            <div className="flex items-center justify-between border-b pb-3.5 border-black/5 dark:border-white/10 relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-pink-500 flex items-center justify-center text-white shadow-lg shadow-[#FF5A36]/30">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-extrabold tracking-tight">Terminal de Cobro & Facturación</h3>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30">
                      POS EN VIVO
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Cliente: <strong className="text-slate-800 dark:text-slate-200 font-bold">{selectedClient?.full_name || '👤 Cliente Ocasional / Mostrador'}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="w-8 h-8 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tarjeta Hero: Total a Cancelar con Contraste Perfecto */}
            <div className={`p-4 sm:p-5 rounded-2xl border text-center relative overflow-hidden transition-all ${
              isDark
                ? 'bg-gradient-to-b from-[#182033] to-[#0E121B] border-white/10 shadow-inner'
                : 'bg-gradient-to-br from-slate-900 via-[#161c2d] to-[#0f1422] text-white border-slate-800 shadow-xl'
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-300">Resumen de la Venta</span>
                <span className="font-bold text-slate-300">{cartItems.length} ítems en ticket</span>
              </div>

              <div className="my-1.5">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  ${cartTotalToPay.toLocaleString()}
                </span>
                <span className="text-sm font-extrabold text-[#FF5A36] ml-2 uppercase tracking-wide">{salonCurrency}</span>
              </div>

              {/* Desglose rápido de beneficios */}
              <div className="flex items-center justify-center gap-2 mt-2 flex-wrap text-[11px]">
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-slate-200 font-medium">
                  Subtotal: ${cartSubtotal.toLocaleString()}
                </span>
                {computedDiscount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                    Descuento: -${computedDiscount.toLocaleString()}
                  </span>
                )}
                {depositDeduction > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold">
                    Anticipo: -${depositDeduction.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Selector de Medios de Pago (6 Tarjetas con Glow) */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] block">
                Selecciona el Medio de Pago:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'efectivo',
                    label: 'Efectivo',
                    sub: 'Billetes / Monedas',
                    icon: '💵',
                    accentColor: 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 shadow-emerald-500/10'
                  },
                  {
                    id: 'nequi',
                    label: 'Nequi',
                    sub: 'QR / Transferencia',
                    icon: '💜',
                    accentColor: 'border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-300 shadow-fuchsia-500/10'
                  },
                  {
                    id: 'daviplata',
                    label: 'Daviplata',
                    sub: 'Número Celular',
                    icon: '🔴',
                    accentColor: 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-300 shadow-red-500/10'
                  },
                  {
                    id: 'tarjeta',
                    label: 'Datáfono',
                    sub: 'Débito / Crédito NFC',
                    icon: '💳',
                    accentColor: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-300 shadow-blue-500/10'
                  },
                  {
                    id: 'transferencia',
                    label: 'Transferencia',
                    sub: 'Bancolombia / Otros',
                    icon: '🏦',
                    accentColor: 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 shadow-cyan-500/10'
                  },
                  {
                    id: 'mixto',
                    label: 'Pago Mixto',
                    sub: 'Efectivo + Digital',
                    icon: '⚡',
                    accentColor: 'border-[#FF5A36] bg-[#FF5A36]/10 text-[#FF5A36] shadow-[#FF5A36]/10'
                  }
                ].map(pm => {
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-150 relative cursor-pointer group flex flex-col justify-between ${
                        isSelected
                          ? `${pm.accentColor} shadow-md ring-2 ring-[#FF5A36]/30`
                          : isDark
                            ? 'border-white/10 bg-[#0E121B]/90 text-slate-400 hover:border-white/20 hover:bg-[#141926]'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{pm.icon}</span>
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                      </div>
                      <div>
                        <strong className={`block text-xs font-extrabold ${
                          isSelected 
                            ? (isDark ? 'text-white' : 'text-slate-900') 
                            : (isDark ? 'text-slate-200 group-hover:text-white' : 'text-slate-800')
                        }`}>
                          {pm.label}
                        </strong>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{pm.sub}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Configuración Dinámica según Método */}
            <div className={`p-4 rounded-2xl border space-y-3 text-xs transition-all ${
              isDark ? 'bg-[#0E121B]/80 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              {/* 1. Flujo EFECTIVO con Billetes Rápidos y Cambio */}
              {paymentMethod === 'efectivo' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 dark:text-slate-300 text-[11px] flex items-center gap-1.5">
                      <span>💵 Efectivo Recibido de la Clienta:</span>
                    </label>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Total a pagar: ${cartTotalToPay.toLocaleString()}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-2.5 font-extrabold text-slate-400 text-sm">$</span>
                      <input
                        type="number"
                        min={0}
                        value={cashReceived || ''}
                        onChange={(e) => setCashReceived(Number(e.target.value) || 0)}
                        placeholder={cartTotalToPay.toString()}
                        className={`w-full pl-8 pr-3 py-2.5 rounded-xl border text-base font-black focus:outline-none focus:border-emerald-500 transition-colors ${
                          isDark ? 'bg-[#141926] border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    {/* Billetes rápidos en Pesos Colombianos */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                      {[
                        { label: 'Exacto', value: cartTotalToPay },
                        { label: '$20k', value: 20000 },
                        { label: '$50k', value: 50000 },
                        { label: '$100k', value: 100000 },
                        { label: '$200k', value: 200000 }
                      ].map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCashReceived(chip.value)}
                          className={`px-2.5 py-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                            cashReceived === chip.value
                              ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold shadow-sm'
                              : isDark 
                                ? 'bg-white/5 border-white/10 hover:bg-white/15 text-slate-300' 
                                : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Indicador de Cambio / Vuelto */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    changeDue > 0
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-300'
                      : changeDue === 0
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-300'
                        : 'bg-red-500/15 border-red-500/30 text-red-600 dark:text-red-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                        changeDue >= 0 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {changeDue >= 0 ? '🪙' : '⚠️'}
                      </div>
                      <div>
                        <strong className="text-xs block font-bold">
                          {changeDue > 0 ? 'Cambio / Vuelto a Devolver' : changeDue === 0 ? 'Pago Exacto (Sin vuelto)' : 'Monto Insuficiente'}
                        </strong>
                        <span className="text-[10px] opacity-85">
                          {changeDue >= 0 ? 'Entrega en efectivo a la clienta' : `Faltan $${Math.abs(changeDue).toLocaleString()} COP`}
                        </span>
                      </div>
                    </div>

                    <strong className="text-base font-black">
                      ${Math.max(0, changeDue).toLocaleString()} {salonCurrency}
                    </strong>
                  </div>
                </div>
              )}

              {/* 2. Flujo NEQUI */}
              {paymentMethod === 'nequi' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-fuchsia-600 dark:text-fuchsia-300 text-xs">💜 Cobro vía Nequi</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Verifica la notificación en tu App Nequi</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">
                      Número de Aprobación / Referencia M (Opcional):
                    </label>
                    <input
                      type="text"
                      value={digitalReferenceCode}
                      onChange={(e) => setDigitalReferenceCode(e.target.value)}
                      placeholder="Ej: M123456 o # celular origen"
                      className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-fuchsia-500 ${
                        isDark ? 'bg-[#141926] border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* 3. Flujo DAVIPLATA */}
              {paymentMethod === 'daviplata' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-600 dark:text-red-300 text-xs">🔴 Cobro vía Daviplata</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Confirmación instantánea</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">
                      Código de Autorización / Celular Daviplata:
                    </label>
                    <input
                      type="text"
                      value={digitalReferenceCode}
                      onChange={(e) => setDigitalReferenceCode(e.target.value)}
                      placeholder="Ej: 300 123 4567 / Aut #9876"
                      className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-red-500 ${
                        isDark ? 'bg-[#141926] border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* 4. Flujo DATÁFONO */}
              {paymentMethod === 'tarjeta' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Tipo de Tarjeta:</label>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => setCardType('debito')}
                          className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                            cardType === 'debito'
                              ? 'bg-blue-500 text-white border-blue-400 shadow-sm'
                              : isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-300 text-slate-700'
                          }`}
                        >
                          Débito
                        </button>
                        <button
                          type="button"
                          onClick={() => setCardType('credito')}
                          className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                            cardType === 'credito'
                              ? 'bg-blue-500 text-white border-blue-400 shadow-sm'
                              : isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-300 text-slate-700'
                          }`}
                        >
                          Crédito
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold"># Voucher / Autorización:</label>
                      <input
                        type="text"
                        value={digitalReferenceCode}
                        onChange={(e) => setDigitalReferenceCode(e.target.value)}
                        placeholder="Ej: 004523"
                        className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none ${
                          isDark ? 'bg-[#141926] border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Flujo TRANSFERENCIA BANCARIA */}
              {paymentMethod === 'transferencia' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Banco Destino:</label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none ${
                          isDark ? 'bg-[#141926] border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      >
                        <option value="Bancolombia">Bancolombia (Ahorros / QR)</option>
                        <option value="Davivienda">Davivienda</option>
                        <option value="BBVA">BBVA Colombia</option>
                        <option value="Banco de Bogotá">Banco de Bogotá</option>
                        <option value="NuBank">Nu Colombia</option>
                        <option value="LuloBank">Lulo Bank</option>
                        <option value="Otro">Otro Banco / PSE</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold"># Comprobante / CUS:</label>
                      <input
                        type="text"
                        value={digitalReferenceCode}
                        onChange={(e) => setDigitalReferenceCode(e.target.value)}
                        placeholder="Ej: CUS 98124501"
                        className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none ${
                          isDark ? 'bg-[#141926] border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Flujo PAGO MIXTO (Efectivo + Digital) */}
              {paymentMethod === 'mixto' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#FF5A36] text-xs">⚡ Desglose de Pago Combinado</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Total: ${cartTotalToPay.toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                      <label className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">💵 Parte Efectivo:</label>
                      <input
                        type="number"
                        min={0}
                        max={cartTotalToPay}
                        value={mixedCash || ''}
                        onChange={(e) => {
                          const val = Math.min(cartTotalToPay, Math.max(0, Number(e.target.value) || 0));
                          setMixedCash(val);
                          setMixedDigital(Math.max(0, cartTotalToPay - val));
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold focus:outline-none ${
                          isDark ? 'bg-[#141926] border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div className="p-2.5 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/5 space-y-1">
                      <label className="text-[10px] font-bold text-fuchsia-600 dark:text-fuchsia-400 uppercase block">📱 Parte Nequi / Tarjeta:</label>
                      <input
                        type="number"
                        min={0}
                        max={cartTotalToPay}
                        value={mixedDigital || ''}
                        onChange={(e) => {
                          const val = Math.min(cartTotalToPay, Math.max(0, Number(e.target.value) || 0));
                          setMixedDigital(val);
                          setMixedCash(Math.max(0, cartTotalToPay - val));
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold focus:outline-none ${
                          isDark ? 'bg-[#141926] border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Checkbox de WhatsApp y Notas */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1 text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sendWhatsAppReceipt}
                  onChange={(e) => setSendWhatsAppReceipt(e.target.checked)}
                  className="rounded text-[#FF5A36] focus:ring-[#FF5A36] w-4 h-4 cursor-pointer"
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1 font-medium">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Abrir comprobante de WhatsApp al finalizar
                </span>
              </label>
            </div>

            {/* Botones de Acción */}
            <div className="flex items-center gap-2.5 pt-2 border-t border-black/5 dark:border-white/10">
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="w-1/3 py-3 rounded-2xl border border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmCheckout}
                disabled={paymentMethod === 'efectivo' && cashReceived < cartTotalToPay && cashReceived > 0 && changeDue < 0}
                className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:opacity-95 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-40"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Cobrar ${cartTotalToPay.toLocaleString()} {salonCurrency}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          NUEVO MODAL: COMPROBANTE TÉRMICO DIGITAL & ÉXITO DE VENTA
          ===================================================================== */}
      {lastCompletedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 relative ${
            isDark ? 'bg-[#141926] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Cabecera de Celebración */}
            <div className="text-center space-y-1.5 pb-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-white">¡Cobro Registrado con Éxito!</h3>
              <p className="text-xs text-slate-400">Venta procesada y comisiones liquidadas al turno.</p>
            </div>

            {/* Recibo Estilo Ticket Térmico */}
            <div className={`p-4 rounded-2xl border font-mono text-xs space-y-2.5 ${
              isDark ? 'bg-[#0E121B] border-white/10 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}>
              <div className="text-center pb-2 border-b border-dashed border-slate-700">
                <strong className="text-sm font-extrabold text-[#FF5A36] block uppercase tracking-wider">{salonName}</strong>
                <span className="text-[10px] text-slate-400 block">TICKET DE VENTA OFICIAL</span>
                <span className="text-[11px] font-bold text-white block mt-0.5">#{lastCompletedSale.sale_number}</span>
              </div>

              <div className="text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Fecha:</span>
                  <span>{new Date(lastCompletedSale.created_at).toLocaleDateString()} {new Date(lastCompletedSale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cliente:</span>
                  <span className="font-bold text-white">{lastCompletedSale.client_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Medio de Pago:</span>
                  <span className="font-bold uppercase text-emerald-400">{lastCompletedSale.payment_method}</span>
                </div>
              </div>

              {/* Lista de Ítems */}
              <div className="border-t border-dashed border-slate-700 pt-2 space-y-1.5 text-[11px]">
                {lastCompletedSale.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div className="pr-2">
                      <strong className="block text-slate-200">{it.quantity}x {it.name}</strong>
                      <span className="text-[9px] text-slate-500">Atendido por: {it.stylist_name || 'Salón'}</span>
                    </div>
                    <span className="font-bold text-white shrink-0">${it.total_cop.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="border-t border-dashed border-slate-700 pt-2 space-y-1 text-[11px]">
                {lastCompletedSale.discount_amount_cop ? (
                  <div className="flex justify-between text-emerald-400">
                    <span>Descuento:</span>
                    <span>-${lastCompletedSale.discount_amount_cop.toLocaleString()}</span>
                  </div>
                ) : null}
                <div className="flex justify-between font-black text-sm text-white pt-1">
                  <span>TOTAL COBRADO:</span>
                  <span className="text-emerald-400 text-base">${lastCompletedSale.total_cop.toLocaleString()} {salonCurrency}</span>
                </div>
                {lastCompletedSale.change_returned_cop ? (
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Cambio Entregado:</span>
                    <span>${lastCompletedSale.change_returned_cop.toLocaleString()}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Acciones */}
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSendWhatsAppReceipt(lastCompletedSale)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2.5 px-3 rounded-xl border border-white/10 hover:bg-white/10 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Ticket</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setLastCompletedSale(null)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#E54E07] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#FF5A36]/25 cursor-pointer hover:opacity-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Listo / Nueva Venta</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          NUEVO MODAL: CONFIRMACIÓN DE PAGO DE COMISIONES (CERO SALDO)
          ===================================================================== */}
      {payoutConfirmData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 relative ${
            isDark ? 'bg-[#141926] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">Liquidación de Comisión</h3>
                  <span className="text-[11px] text-slate-400">Pasa el saldo a $0 y registra la salida</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPayoutConfirmData(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tarjeta con Especialista y Monto */}
            <div className={`p-4 rounded-2xl border text-center space-y-2 ${
              isDark ? 'bg-[#0E121B] border-white/10' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <span className="text-xs text-slate-400 block font-semibold">Total Pendiente a Liquidar a:</span>
              <strong className="text-lg font-black text-white block">{payoutConfirmData.stylistName}</strong>
              <div className="my-1">
                <span className="text-3xl font-black text-emerald-400">
                  ${payoutConfirmData.amountCop.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-slate-400 ml-1.5">{salonCurrency}</span>
              </div>
              <span className="text-[11px] text-emerald-300 block font-medium">
                ✅ Al confirmar, el saldo de este especialista quedará en $0 COP.
              </span>
            </div>

            {/* Selector de Forma de Entrega */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                Forma de Entrega del Dinero:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPayoutConfirmData(prev => prev ? { ...prev, paymentMethod: 'cash' } : null)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    payoutConfirmData.paymentMethod === 'cash'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <span>💵 Efectivo de Caja</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutConfirmData(prev => prev ? { ...prev, paymentMethod: 'transfer' } : null)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    payoutConfirmData.paymentMethod === 'transfer'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <span>🏦 Transferencia</span>
                </button>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPayoutConfirmData(null)}
                className="w-1/3 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteCommissionPayout}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/25 cursor-pointer transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar Pago (${payoutConfirmData.amountCop.toLocaleString()})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 4: REPORTE Z DE CIERRE DE CAJA (DESCARGABLE / IMPRIMIBLE)
          ===================================================================== */}
      {showZReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 ${
            isDark ? 'bg-[#141926] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Reporte Z Oficial de Cierre</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowZReportModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formato Ticket Fiscal */}
            <div className={`p-5 rounded-xl border space-y-3 font-mono text-xs ${
              isDark ? 'bg-[#0E121B] border-white/10 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}>
              <div className="text-center space-y-0.5 border-b pb-3 border-dashed border-slate-700">
                <strong className="text-sm font-extrabold text-white block uppercase">{salonName}</strong>
                <span className="text-[10px] text-slate-400 block">COMPROBANTE DE CIERRE FISCAL (REPORTE Z)</span>
                <span className="text-[10px] text-slate-400 block">Turno ID: #{showZReportModal.id.slice(-6)}</span>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Apertura:</span>
                  <span>{new Date(showZReportModal.opened_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cierre:</span>
                  <span>{showZReportModal.closed_at ? new Date(showZReportModal.closed_at).toLocaleString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Responsable:</span>
                  <span className="font-bold text-white">{showZReportModal.closed_by_name || showZReportModal.opened_by_name}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-700 pt-2 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Base Inicial Efectivo:</span>
                  <span>${showZReportModal.initial_amount_cop.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ventas Efectivo:</span>
                  <span>+${(showZReportModal.total_cash_sales_cop || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ventas Nequi/Daviplata:</span>
                  <span>${(showZReportModal.total_digital_sales_cop || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ventas Datáfono:</span>
                  <span>${(showZReportModal.total_card_sales_cop || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-white pt-1 border-t border-dashed border-slate-700">
                  <span>TOTAL FACTURADO BRUTO:</span>
                  <span className="text-emerald-400">${(showZReportModal.total_sales_cop || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-700 pt-2 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Efectivo Teórico Esperado:</span>
                  <span>${(showZReportModal.expected_cash_cop || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Efectivo Físico Contado:</span>
                  <span className="font-bold text-white">${(showZReportModal.actual_cash_cop || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Diferencia de Cuadre:</span>
                  <span className={(showZReportModal.difference_cash_cop || 0) === 0 ? 'text-emerald-400' : 'text-red-400'}>
                    ${(showZReportModal.difference_cash_cop || 0).toLocaleString()} COP
                  </span>
                </div>
              </div>

              {showZReportModal.closing_notes && (
                <div className="border-t border-dashed border-slate-700 pt-2 text-[10px] text-slate-400">
                  <span>Obs: {showZReportModal.closing_notes}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-1/2 py-2.5 rounded-xl border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-white/10 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Reporte</span>
              </button>
              <button
                type="button"
                onClick={() => setShowZReportModal(null)}
                className="w-1/2 py-2.5 rounded-xl bg-[#FF5A36] text-white font-bold text-xs flex items-center justify-center cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 5: REGISTRAR COBRO ADICIONAL / RECARGO EXTRA
          ===================================================================== */}
      {isExtraChargeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 ${
            isDark ? 'bg-[#141926] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Agregar Cobro Adicional</h3>
                  <span className="text-[11px] text-slate-400">Recargo por longitud, retiro de acrílico o ampolleta</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExtraChargeModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets Rápidos */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                💡 Conceptos Frecuentes Rápidos:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { concept: 'Cabello Extra Largo / Abundante', price: 20000 },
                  { concept: 'Retiro Semipermanente Anterior', price: 12000 },
                  { concept: 'Retiro de Acrílico / Esculpidas', price: 18000 },
                  { concept: 'Ampolleta / Plex Adicional', price: 25000 },
                  { concept: 'Recargo Fuera de Horario / Festivo', price: 25000 },
                  { concept: 'Diseño Especial / Nail Art Extra', price: 15000 }
                ].map((pre, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setExtraConcept(pre.concept);
                      setExtraAmount(pre.price);
                    }}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      extraConcept === pre.concept
                        ? 'border-amber-500 bg-amber-500/15 text-white'
                        : isDark ? 'border-white/5 bg-[#0E121B] text-slate-300 hover:border-white/20' : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-[11px] font-semibold block leading-tight">{pre.concept}</span>
                    <strong className="text-[10px] text-amber-400">+${pre.price.toLocaleString()}</strong>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddExtraCharge} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Concepto del Cobro Extra:</label>
                <input
                  type="text"
                  value={extraConcept}
                  onChange={(e) => setExtraConcept(e.target.value)}
                  required
                  placeholder="Ej: Cabello extra largo / densidad alta..."
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-amber-500 ${
                    isDark ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">Valor Recargo ($ COP):</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 font-bold text-slate-400">$</span>
                    <input
                      type="number"
                      min={1000}
                      value={extraAmount || ''}
                      onChange={(e) => setExtraAmount(Number(e.target.value) || 0)}
                      required
                      placeholder="0"
                      className={`w-full pl-7 pr-3 py-2 rounded-xl border text-xs font-bold focus:outline-none focus:border-amber-500 ${
                        isDark ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-slate-50 border-slate-300'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-400 block mb-1">Especialista:</label>
                  <select
                    value={extraStylistName}
                    onChange={(e) => setExtraStylistName(e.target.value)}
                    className={`w-full px-2.5 py-2 rounded-xl border text-xs focus:outline-none ${
                      isDark ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    {stylists.map(st => (
                      <option key={st.id} value={st.name} className={isDark ? 'bg-[#0E121B]' : 'bg-white'}>
                        {st.name} ({st.commission_service_pct}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExtraChargeModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!extraConcept.trim() || extraAmount <= 0}
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar al Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 6: DETALLE DE TICKETS Y COMISIONES POR ESPECIALISTA
          ===================================================================== */}
      {selectedStylistDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-2xl p-6 rounded-2xl border shadow-2xl space-y-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 ${
            isDark ? 'bg-[#141926] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Desglose de Producción: {selectedStylistDetail.stylistName}</h3>
                  <span className="text-[11px] text-slate-400">
                    Esquema: {selectedStylistDetail.stylistCommissionServicePct}% Servicios • {selectedStylistDetail.stylistCommissionRetailPct}% Retail
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStylistDetail(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Resumen Superior */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#0E121B] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Facturado</span>
                <strong className="text-sm font-extrabold text-blue-400">${selectedStylistDetail.totalGrossCop.toLocaleString()} {salonCurrency}</strong>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#0E121B] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Comisión Ganada</span>
                <strong className="text-sm font-extrabold text-slate-200">${selectedStylistDetail.totalCommCop.toLocaleString()} {salonCurrency}</strong>
                {selectedStylistDetail.commPaidCop > 0 && (
                  <span className="text-[9px] text-emerald-400 block">Pagado: ${selectedStylistDetail.commPaidCop.toLocaleString()}</span>
                )}
              </div>
              <div className={`p-3 rounded-xl border ${
                selectedStylistDetail.pendingCommCop === 0
                  ? 'bg-emerald-500/10 border-emerald-500/20'
                  : 'bg-amber-500/10 border-amber-500/20'
              }`}>
                <span className={`text-[10px] block font-bold uppercase ${
                  selectedStylistDetail.pendingCommCop === 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  Saldo Pendiente
                </span>
                <strong className={`text-sm font-extrabold ${
                  selectedStylistDetail.pendingCommCop === 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  ${selectedStylistDetail.pendingCommCop.toLocaleString()} {salonCurrency}
                </strong>
                {selectedStylistDetail.pendingCommCop === 0 && (
                  <span className="text-[9px] text-emerald-400 block font-bold">✅ AL DÍA</span>
                )}
              </div>
            </div>

            {/* Lista de Tickets / Servicios */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
              {selectedStylistDetail.items.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  No hay tickets registrados para este especialista en el período seleccionado.
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className={`border-b text-[11px] ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                      <th className="pb-2">Ticket #</th>
                      <th className="pb-2">Fecha / Hora</th>
                      <th className="pb-2">Cliente</th>
                      <th className="pb-2">Servicio / Producto</th>
                      <th className="pb-2">Valor Cobrado</th>
                      <th className="pb-2 text-right">Comisión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5 text-[11px]">
                    {selectedStylistDetail.items.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="py-2.5 font-mono font-bold text-[#FF5A36]">{entry.saleNumber}</td>
                        <td className="py-2.5 text-slate-400">{new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="py-2.5 font-medium">{entry.clientName}</td>
                        <td className="py-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mr-1.5 ${
                            entry.item.type === 'service' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {entry.item.type === 'service' ? 'Serv' : 'Ret'}
                          </span>
                          <span>{entry.item.name}</span>
                        </td>
                        <td className="py-2.5 font-bold">${entry.item.total_cop.toLocaleString()}</td>
                        <td className="py-2.5 text-right font-extrabold text-emerald-400">
                          +${(entry.item.commission_amount_cop || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer con Acciones */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-black/5 dark:border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setSelectedStylistDetail(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                Cerrar
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSendStylistWhatsApp(
                    selectedStylistDetail.stylistName,
                    '',
                    selectedStylistDetail.totalCommCop,
                    selectedStylistDetail.totalGrossCop,
                    selectedStylistDetail.servicesCount
                  )}
                  className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/25 text-emerald-400 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Enviar WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handlePayStylistCommission(selectedStylistDetail.stylistName, selectedStylistDetail.pendingCommCop);
                    setSelectedStylistDetail(null);
                  }}
                  disabled={selectedStylistDetail.pendingCommCop <= 0}
                  className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                    selectedStylistDetail.pendingCommCop <= 0
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default opacity-80'
                      : 'bg-gradient-to-r from-[#FF5A36] to-[#E54E07] text-white shadow-lg shadow-[#FF5A36]/20 cursor-pointer'
                  }`}
                >
                  {selectedStylistDetail.pendingCommCop <= 0 ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Comisión al Día ($0)</span>
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Pagar Saldo (${selectedStylistDetail.pendingCommCop.toLocaleString()})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
