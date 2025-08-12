
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const Row = ({ name, index, data, setRotatingValue, isRunning, speed, direction, setEndValue }) => {
  const [value, setValue] = useState(0);
  const intervalRef = useRef(null);

  const counterIntervalFunction = useCallback(() => {
    if (isRunning) {
      if (direction === 'ltr') {
        setValue(prevValue => (prevValue < 2 ? prevValue + 1 : 0));
      } else {
        setValue(prevValue => (prevValue > 0 ? prevValue - 1 : 2));
      }
    } else {
      clearInterval(intervalRef.current);
    }
  }, [isRunning, direction]);

  useEffect(() => {
    setRotatingValue(index, value);
  }, [value, index, setRotatingValue]);

  useEffect(() => {
    intervalRef.current = setInterval(counterIntervalFunction, speed);
    return () => clearInterval(intervalRef.current);
  }, [counterIntervalFunction, speed]);

  const activeRowIndex = data.activeRowIndex;
  const activeClass = index === activeRowIndex ? 'active' : '';
  const columnsClassList = `columns columns-${name}`;
  const wrapperClassList = `row ${activeClass}`;
  const animation = `${direction}-transition-${value}`;
  const style = {
    animationName: animation,
    animationDuration: `${speed}ms`
  };

  return (
    <div className={wrapperClassList}>
      <div className={columnsClassList} style={style}>
        <div className="column"></div>
        <div className="column"></div>
        <div className="column"></div>
      </div>
    </div>
  );
};

const Results = ({ shown, prize }) => {
  const messages = ['3UP', '5UP', '2UP', 'No Prize'];
  const classList = `results ${shown ? 'shown' : ''}`;
  return <div className={classList}>{messages[prize]}</div>;
};

const MarioSlotsGame = () => {
  const [rows, setRows] = useState([
    { name: 'top', index: 0, value: 0, endValue: 0, speed: 200, isRunning: true, key: Math.random(), direction: 'ltr' },
    { name: 'center', value: 0, index: 1, endValue: 0, speed: 200, isRunning: true, key: Math.random(), direction: 'rtl' },
    { name: 'bottom', value: 0, index: 2, endValue: 0, speed: 200, isRunning: true, key: Math.random(), direction: 'ltr' }
  ]);
  const [prize, setPrize] = useState(3);
  const [activeRowIndex, setActiveRowIndex] = useState(0);

  const setRotatingValue = useCallback((index, value) => {
    setRows(currentRows => {
      const newRows = [...currentRows];
      const row = newRows[index];
      if (row) {
        row.value = value;
        newRows[index] = row;
      }
      return newRows;
    });
  }, []);

  const setEndValue = useCallback((index, value) => {
    setRows(currentRows => {
      const newRows = [...currentRows];
      const row = newRows[index];
      row.endValue = value;
      newRows[index] = row;
      return newRows;
    });
  }, []);

  const cancelInterval = useCallback((index) => {
    setRows(currentRows => {
      const newRows = [...currentRows];
      const row = newRows[index];
      row.isRunning = false;
      newRows[index] = row;
      return newRows;
    });
  }, []);
  
  const resetGame = useCallback(() => {
    setRows(currentRows => currentRows.map(row => ({
      ...row,
      key: Math.random(),
      isRunning: true,
      endValue: 0,
    })));
    setActiveRowIndex(0);
    setPrize(3);
  }, []);
  
  const determinePrize = useCallback(() => {
     setRows(currentRows => {
        const endValues = currentRows.map(row => row.endValue);
        let newPrize = 3; // Default to 'No Prize'
        if(endValues.every(val => val === endValues[0])){
            newPrize = endValues[0];
        }
        setPrize(newPrize);
        return currentRows;
     })
  }, []);

  const handleClick = useCallback(() => {
    if (activeRowIndex < rows.length) {
      cancelInterval(activeRowIndex);
      setEndValue(activeRowIndex, rows[activeRowIndex].value);
      setActiveRowIndex(prev => prev + 1);
    } else {
      resetGame();
    }
  }, [activeRowIndex, rows, cancelInterval, setEndValue, resetGame]);

  useEffect(() => {
      if (activeRowIndex === rows.length) {
          determinePrize();
      }
  }, [activeRowIndex, rows.length, determinePrize]);


  useEffect(() => {
    const handleKeyPress = (e) => {
        handleClick();
    };
    
    document.body.addEventListener('touchstart', handleClick);
    window.addEventListener('keypress', handleKeyPress);

    return () => {
      document.body.removeEventListener('touchstart', handleClick);
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleClick]);

  return (
    <>
      <style jsx global>{`
        body {
          font-family: 'VT323', sans-serif;
          background: #000000;
          overflow: hidden;
        }
        .mario-slots-container:after {
          content: '';
          display: block;
          position: fixed;
          top: 50%;
          right: 18%;
          left: 18%;
          border: .5vw solid white;
          bottom: 44%;
          padding-top: 39%;
          transform: translateY(-50%);
          box-sizing: border-box;
          pointer-events: none;
        }
        .helper {
          position: fixed;
          bottom: 1rem;
          z-index: 100;
          color: #fff;
          text-align: center;
          left: 0;
          right: 0;
          pointer-events: none;
          font-size: 3vw;
          opacity: .5;
        }
        .viewport {
          display: block;
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          box-sizing: border-box;
        }
        .viewport:before {
          content: '';
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 20%;
          background: #000000;
          z-index: 10;
        }
        .viewport:after {
          content: '';
          display: block;
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 20%;
          background: #000000;
          z-index: 10;
        }
        .game {
          position: absolute;
          top: 50%;
          right: 0;
          left: 0;
          transform: translateY(-50%);
        }
        .results {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateY(100%);
          transition: transform 1s ease;
          color: #B53121;
          font-size: 6vw;
          text-shadow: 2px 2px 2px #fff;
        }
        .results.shown {
          transform: translateY(0);
        }
        .columns {
          background-color: #FDCBC4;
          background-size: 100% 100%;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
        .columns.columns-top {
          background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/233661/mario-top.svg');
        }
        .columns.columns-center {
          background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/233661/mario-center.svg');
        }
        .columns.columns-bottom {
          background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/233661/mario-bottom.svg');
        }
        .columns:after {
          content: '';
          display: block;
          padding-top: 12.07%;
        }
        @keyframes ltr-transition-0 { 0% { background-position: 0vw; } 100% { background-position: 33.3333vw; } }
        @keyframes ltr-transition-1 { 0% { background-position: 33.3333vw; } 100% { background-position: 66.6666vw; } }
        @keyframes ltr-transition-2 { 0% { background-position: 66.6666vw; } 100% { background-position: 100vw; } }
        @keyframes rtl-transition-0 { 0% { background-position: -33.3333vw; } 100% { background-position: -66.6666vw; } }
        @keyframes rtl-transition-1 { 0% { background-position: -100vw; } 100% { background-position: -133.3333vw; } }
        @keyframes rtl-transition-2 { 0% { background-position: -166.6666vw; } 100% { background-position: -200vw; } }
      `}</style>
      <div className="mario-slots-container">
        <div className="viewport">
          <div className="game">
            <div className="rows">
              {rows.map(row => (
                <Row
                  name={row.name}
                  index={row.index}
                  data={{ activeRowIndex }}
                  setRotatingValue={setRotatingValue}
                  setEndValue={setEndValue}
                  isRunning={row.isRunning}
                  speed={row.speed}
                  key={row.key}
                  direction={row.direction}
                />
              ))}
            </div>
          </div>
          <Results shown={activeRowIndex === 3} prize={prize} />
        </div>
        <div className="helper">Press a key or tap to play</div>
        <Button asChild variant="outline" className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hub
            </Link>
        </Button>
      </div>
    </>
  );
};

export default MarioSlotsGame;
