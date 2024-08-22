import { useEffect, useReducer } from 'react';

const rows = 6;
const cols = 5;
const ans = 'RIGHT';

const initialState = {
  array: Array(rows)
    .fill()
    .map(() => Array(cols).fill('')),
  nowRow: 0,
  nowCol: 0,
  gameStatus: 'playing',
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_LETTER': {
      if (state.nowCol >= cols) return state;
      const newArray = JSON.parse(JSON.stringify([...state.array]));
      newArray[state.nowRow][state.nowCol] = action.letter.toUpperCase();
      return {
        ...state,
        array: newArray,
        nowCol: state.nowCol + 1,
      };
    }
    case 'REMOVE_LETTER': {
      if (state.nowCol <= 0) return state;
      const newArray = JSON.parse(JSON.stringify([...state.array]));
      newArray[state.nowRow][state.nowCol - 1] = '';
      return {
        ...state,
        array: newArray,
        nowCol: state.nowCol - 1,
      };
    }
    case 'SUBMIT_GUESS': {
      if (state.nowCol < cols) return state;
      if (state.array[state.nowRow].join('') === ans)
        return {
          ...state,
          nowRow: state.nowRow + 1,
          gameStatus: 'complete',
        };
      if (state.nowRow === rows - 1 && state.nowCol === cols)
        return {
          ...state,
          nowRow: state.nowRow + 1,
          gameStatus: 'fail',
        };
      return {
        ...state,
        nowRow: state.nowRow + 1,
        nowCol: 0,
      };
    }
    case 'RESET': {
      return initialState;
    }
    default:
      return state;
  }
}

function getColors(row, rowIndex, nowRow) {
  let tempAnsArr = [...ans];

  if (rowIndex >= nowRow) {
    return row.map(() => 'bg-white');
  }

  let colors = row.map((letter, j) => {
    if (letter === ans[j]) {
      tempAnsArr[j] = null;
      return 'bg-green-500';
    }
    return null;
  });

  colors = colors.map((color, j) => {
    if (color === null) {
      let notExactMatch = tempAnsArr.indexOf(row[j]);
      if (notExactMatch !== -1) {
        tempAnsArr[notExactMatch] = null;
        return 'bg-yellow-500';
      } else {
        return 'bg-gray-500';
      }
    }
    return color;
  });

  return colors;
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const handleKeydown = (event) => {
      switch (event.key) {
        case 'Enter':
          dispatch({
            type: 'SUBMIT_GUESS',
          });
          break;
        case 'Backspace':
          dispatch({
            type: 'REMOVE_LETTER',
          });
          break;
        default:
          if (/^[a-zA-Z]$/.test(event.key)) {
            dispatch({
              type: 'ADD_LETTER',
              letter: event.key,
            });
          }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (state.gameStatus !== 'playing') {
        if (state.gameStatus === 'complete') {
          alert('你答對了!!');
        }
        if (state.gameStatus === 'fail') {
          alert('再多嘗試幾次吧~~');
        }
        dispatch({
          type: 'RESET',
        });
      }
    }, 100);
  }, [state.gameStatus]);

  return (
    <div className="flex flex-col w-[350px] mx-auto mt-5">
      {state.array.map((row, i) => {
        const colors = getColors(row, i, state.nowRow);
        return (
          <div key={i} className="flex justify-between mb-2">
            {row.map((cell, j) => (
              <div
                key={j}
                className={`flex items-center justify-center border border-gray-300 w-[62px] h-[62px] text-base ${colors[j]}`}
              >
                {cell}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default App;
