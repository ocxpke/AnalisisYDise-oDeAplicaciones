import { useState } from 'react';
import { X, CreditCard, Wallet as WalletIcon, Smartphone, Loader } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabaseClient';

interface WalletModalProps {
  language: 'es' | 'en';
  simplifiedMode: boolean;
  userId: string;
  currentBalance: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function WalletModal({
  language,
  simplifiedMode,
  userId,
  currentBalance,
  onClose,
  onSuccess,
}: WalletModalProps) {
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bizum'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Datos de tarjeta de crédito
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const suggestedAmounts = [10, 20, 50, 100];

  const translations = {
    es: {
      title: 'Añadir dinero al monedero',
      currentBalance: 'Saldo actual',
      selectAmount: 'Selecciona una cantidad',
      customAmount: 'Otra cantidad',
      paymentMethod: 'Método de pago',
      card: 'Tarjeta Bancaria',
      paypal: 'PayPal',
      bizum: 'Bizum',
      cardNumber: 'Número de tarjeta',
      cardName: 'Nombre en la tarjeta',
      expiryDate: 'Fecha de vencimiento',
      cvv: 'CVV',
      cancel: 'Cancelar',
      addMoney: 'Añadir dinero',
      processing: 'Procesando...',
      enterAmount: 'Por favor, introduce una cantidad',
      enterValidAmount: 'Por favor, introduce una cantidad válida',
      minAmount: 'La cantidad mínima es 5€',
      fillCardDetails: 'Por favor, completa los datos de la tarjeta',
      paypalRedirect: 'Serás redirigido a PayPal para completar el pago',
      bizumInstructions: 'Introduce el código Bizum en tu aplicación bancaria',
      bizumCode: 'Código Bizum',
      success: 'Dinero añadido correctamente',
      error: 'Error al añadir dinero',
    },
    en: {
      title: 'Add money to wallet',
      currentBalance: 'Current balance',
      selectAmount: 'Select an amount',
      customAmount: 'Custom amount',
      paymentMethod: 'Payment method',
      card: 'Credit/Debit Card',
      paypal: 'PayPal',
      bizum: 'Bizum',
      cardNumber: 'Card number',
      cardName: 'Cardholder name',
      expiryDate: 'Expiry date',
      cvv: 'CVV',
      cancel: 'Cancel',
      addMoney: 'Add money',
      processing: 'Processing...',
      enterAmount: 'Please enter an amount',
      enterValidAmount: 'Please enter a valid amount',
      minAmount: 'Minimum amount is €5',
      fillCardDetails: 'Please fill in card details',
      paypalRedirect: 'You will be redirected to PayPal to complete the payment',
      bizumInstructions: 'Enter the Bizum code in your banking app',
      bizumCode: 'Bizum Code',
      success: 'Money added successfully',
      error: 'Error adding money',
    },
  };

  const t = translations[language];

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue);
    } else {
      setAmount('');
    }
  };

  const validateForm = () => {
    if (!amount || amount <= 0) {
      toast.error(t.enterValidAmount);
      return false;
    }

    if (amount < 5) {
      toast.error(t.minAmount);
      return false;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast.error(t.fillCardDetails);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Simulación de procesamiento de pago
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Actualizar el saldo del monedero en la base de datos
      const newBalance = currentBalance + (amount as number);
      
      const { error } = await supabase
        .from('usuario')
        .update({ monedero: newBalance })
        .eq('id', parseInt(userId));

      if (error) {
        console.error('Error actualizando monedero:', error);
        toast.error(t.error);
        setIsProcessing(false);
        return;
      }

      toast.success(`${t.success}: +${amount}€`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error en el pago:', error);
      toast.error(t.error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
        simplifiedMode ? 'p-8' : 'p-6'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-[#00A859] ${simplifiedMode ? 'text-3xl' : 'text-2xl'}`}>
            {t.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isProcessing}
          >
            <X className={simplifiedMode ? 'w-8 h-8' : 'w-6 h-6'} />
          </button>
        </div>

        {/* Saldo actual */}
        <div className={`bg-[#00A859] text-white rounded-xl p-4 mb-6 ${
          simplifiedMode ? 'text-xl' : ''
        }`}>
          <p className="opacity-90 mb-1">{t.currentBalance}</p>
          <p className={simplifiedMode ? 'text-4xl' : 'text-3xl'}>
            {currentBalance.toFixed(2)}€
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Selección de cantidad */}
          <div className="mb-6">
            <label className={`block text-gray-700 mb-3 ${simplifiedMode ? 'text-xl' : ''}`}>
              {t.selectAmount}
            </label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {suggestedAmounts.map((suggestedAmount) => (
                <button
                  key={suggestedAmount}
                  type="button"
                  onClick={() => handleAmountSelect(suggestedAmount)}
                  className={`rounded-xl border-2 transition-all ${
                    amount === suggestedAmount
                      ? 'border-[#00A859] bg-[#00A859] text-white'
                      : 'border-gray-300 hover:border-[#00A859] bg-white'
                  } ${simplifiedMode ? 'py-4 text-2xl' : 'py-3 text-xl'}`}
                  disabled={isProcessing}
                >
                  {suggestedAmount}€
                </button>
              ))}
            </div>
            <div>
              <label className={`block text-gray-600 mb-2 ${simplifiedMode ? 'text-lg' : 'text-sm'}`}>
                {t.customAmount}
              </label>
              <input
                type="number"
                min="5"
                step="0.01"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder="0.00"
                className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                  simplifiedMode ? 'py-4 text-xl' : 'py-3'
                }`}
                disabled={isProcessing}
              />
            </div>
          </div>

          {/* Método de pago */}
          <div className="mb-6">
            <label className={`block text-gray-700 mb-3 ${simplifiedMode ? 'text-xl' : ''}`}>
              {t.paymentMethod}
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center justify-center rounded-xl border-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#00A859] bg-[#00A859] text-white'
                    : 'border-gray-300 hover:border-[#00A859] bg-white'
                } ${simplifiedMode ? 'py-5' : 'py-4'}`}
                disabled={isProcessing}
              >
                <CreditCard className={simplifiedMode ? 'w-8 h-8 mb-2' : 'w-6 h-6 mb-2'} />
                <span className={simplifiedMode ? 'text-base' : 'text-sm'}>{t.card}</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`flex flex-col items-center justify-center rounded-xl border-2 transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-[#00A859] bg-[#00A859] text-white'
                    : 'border-gray-300 hover:border-[#00A859] bg-white'
                } ${simplifiedMode ? 'py-5' : 'py-4'}`}
                disabled={isProcessing}
              >
                <WalletIcon className={simplifiedMode ? 'w-8 h-8 mb-2' : 'w-6 h-6 mb-2'} />
                <span className={simplifiedMode ? 'text-base' : 'text-sm'}>{t.paypal}</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bizum')}
                className={`flex flex-col items-center justify-center rounded-xl border-2 transition-all ${
                  paymentMethod === 'bizum'
                    ? 'border-[#00A859] bg-[#00A859] text-white'
                    : 'border-gray-300 hover:border-[#00A859] bg-white'
                } ${simplifiedMode ? 'py-5' : 'py-4'}`}
                disabled={isProcessing}
              >
                <Smartphone className={simplifiedMode ? 'w-8 h-8 mb-2' : 'w-6 h-6 mb-2'} />
                <span className={simplifiedMode ? 'text-base' : 'text-sm'}>{t.bizum}</span>
              </button>
            </div>
          </div>

          {/* Formulario de tarjeta */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className={`block text-gray-700 mb-2 ${simplifiedMode ? 'text-lg' : 'text-sm'}`}>
                  {t.cardNumber}
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                    simplifiedMode ? 'py-4 text-xl' : 'py-3'
                  }`}
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className={`block text-gray-700 mb-2 ${simplifiedMode ? 'text-lg' : 'text-sm'}`}>
                  {t.cardName}
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="NOMBRE APELLIDOS"
                  className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                    simplifiedMode ? 'py-4 text-xl' : 'py-3'
                  }`}
                  disabled={isProcessing}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-gray-700 mb-2 ${simplifiedMode ? 'text-lg' : 'text-sm'}`}>
                    {t.expiryDate}
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 2) {
                        setExpiryDate(value);
                      } else {
                        setExpiryDate(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
                      }
                    }}
                    placeholder="MM/AA"
                    maxLength={5}
                    className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                      simplifiedMode ? 'py-4 text-xl' : 'py-3'
                    }`}
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label className={`block text-gray-700 mb-2 ${simplifiedMode ? 'text-lg' : 'text-sm'}`}>
                    {t.cvv}
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="123"
                    maxLength={3}
                    className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                      simplifiedMode ? 'py-4 text-xl' : 'py-3'
                    }`}
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Información de PayPal */}
          {paymentMethod === 'paypal' && (
            <div className={`bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 ${
              simplifiedMode ? 'text-lg' : ''
            }`}>
              <p className="text-blue-800">{t.paypalRedirect}</p>
            </div>
          )}

          {/* Información de Bizum */}
          {paymentMethod === 'bizum' && (
            <div className={`bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6 ${
              simplifiedMode ? 'text-lg' : ''
            }`}>
              <p className="text-purple-800 mb-3">{t.bizumInstructions}</p>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">{t.bizumCode}</p>
                <p className="text-3xl text-purple-600 tracking-wider">00000</p>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors ${
                simplifiedMode ? 'py-4 text-xl' : 'py-3'
              }`}
              disabled={isProcessing}
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className={`flex-1 bg-[#00A859] text-white rounded-xl hover:bg-[#008A47] transition-colors flex items-center justify-center gap-2 ${
                simplifiedMode ? 'py-4 text-xl' : 'py-3'
              }`}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {t.processing}
                </>
              ) : (
                t.addMoney
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
