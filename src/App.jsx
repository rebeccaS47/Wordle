import { useState, useEffect } from 'react';

const rows = 6;
const cols = 5;

function App() {
  const [array, setArray] = useState(
    Array(rows)
      .fill()
      .map(() => Array(cols).fill(''))
  );
  const [nowRow, setNowRow] = useState(0);
  const [nowCol, setNowCol] = useState(0);

  useEffect(() => {
    const handleKeydown = (event) => {
      event.preventDefault();
      switch (event.key) {
        case 'Enter':
          console.log(array[nowRow]);
          break;
        case 'Backspace':
          removeLetterInBox(nowRow, nowCol);
          break;
        default:
          if (/^[a-zA-Z]$/.test(event.key)) {
            addLetterInBox(event.key, nowRow, nowCol);
          }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [nowRow, nowCol, array]);

  function removeLetterInBox(i, j) {
    setArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[i][j - 1] = '';
      return newArray;
    });
    setNowCol((prevCol) => prevCol - 1);
  }

  function addLetterInBox(letter, i, j) {
    setArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[i][j] = letter.toUpperCase();
      return newArray;
    });
    setNowCol((prevCol) => prevCol + 1);
  }

  return (
    <div
      className="flex flex-col"
      style={{
        width: '350px',
        margin: '20px auto 0px',
      }}
    >
      {array.map((row, i) => (
        <div key={i} className="flex justify-between mb-2">
          {row.map((cell, j) => (
            <div
              key={j}
              className="flex items-center justify-center border border-gray-300"
              style={{ width: '62px', height: '62px', fontSize: '24px' }}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
