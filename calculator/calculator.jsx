import React, { useState } from 'react';
import { Delete, RotateCcw } from 'lucide-react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '%':
        return firstValue % secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  const Button = ({ children, onClick, className = '', variant = 'default' }) => {
    const baseClass = 'h-16 rounded-xl font-semibold text-lg transition-all duration-200 active:scale-95 shadow-sm';
    const variants = {
      default: 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200',
      operator: 'bg-orange-500 text-white hover:bg-orange-600',
      equals: 'bg-blue-600 text-white hover:bg-blue-700',
      function: 'bg-slate-200 text-slate-700 hover:bg-slate-300'
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClass} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Calculator Body */}
        <div className="bg-slate-900 rounded-3xl shadow-2xl p-6">
          {/* Display */}
          <div className="mb-6 bg-slate-800 rounded-2xl p-6 shadow-inner">
            <div className="text-right">
              <div className="text-slate-400 text-sm mb-1 h-5">
                {operation && previousValue !== null ? `${previousValue} ${operation}` : ''}
              </div>
              <div className="text-white text-5xl font-light overflow-hidden overflow-ellipsis">
                {display}
              </div>
            </div>
          </div>

          {/* Buttons Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 */}
            <Button variant="function" onClick={clear}>
              <div className="flex items-center justify-center gap-1">
                <RotateCcw className="w-4 h-4" />
                AC
              </div>
            </Button>
            <Button variant="function" onClick={toggleSign}>
              +/-
            </Button>
            <Button variant="function" onClick={() => performOperation('%')}>
              %
            </Button>
            <Button variant="operator" onClick={() => performOperation('÷')}>
              ÷
            </Button>

            {/* Row 2 */}
            <Button onClick={() => inputDigit(7)}>7</Button>
            <Button onClick={() => inputDigit(8)}>8</Button>
            <Button onClick={() => inputDigit(9)}>9</Button>
            <Button variant="operator" onClick={() => performOperation('×')}>
              ×
            </Button>

            {/* Row 3 */}
            <Button onClick={() => inputDigit(4)}>4</Button>
            <Button onClick={() => inputDigit(5)}>5</Button>
            <Button onClick={() => inputDigit(6)}>6</Button>
            <Button variant="operator" onClick={() => performOperation('-')}>
              −
            </Button>

            {/* Row 4 */}
            <Button onClick={() => inputDigit(1)}>1</Button>
            <Button onClick={() => inputDigit(2)}>2</Button>
            <Button onClick={() => inputDigit(3)}>3</Button>
            <Button variant="operator" onClick={() => performOperation('+')}>
              +
            </Button>

            {/* Row 5 */}
            <Button onClick={() => inputDigit(0)} className="col-span-2">
              0
            </Button>
            <Button onClick={inputDecimal}>.</Button>
            <Button variant="equals" onClick={handleEquals}>
              =
            </Button>
          </div>

          {/* Backspace Button */}
          <div className="mt-3">
            <Button variant="function" onClick={backspace} className="w-full flex items-center justify-center gap-2">
              <Delete className="w-5 h-5" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}