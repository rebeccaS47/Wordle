import { useEffect, useReducer } from 'react';
import { db } from './firebase/firebase.config';
import { collection, getDocs, query } from 'firebase/firestore';

const rows = 6;
const cols = 5;
const ans = 'RIGHT';

const initialState = {
  array: Array(rows)
    .fill()
    .map(() => Array(cols).fill('')),
  nowRow: 0,
  nowCol: 0,
};

function reducer(state, action) {
  if (state.nowCol === -1) return state;
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
      if (state.array[state.nowRow].join('') === ans) {
        setTimeout(() => {
          alert('你答對了!!!');
        }, 100);
        return {
          ...state,
          nowRow: state.nowRow + 1,
          nowCol: -1,
        };
      }
      if (state.nowRow === rows - 1 && state.nowCol === cols) {
        alert('再多嘗試幾次吧~~');
        return initialState;
      }
      return {
        ...state,
        nowRow: state.nowRow + 1,
        nowCol: 0,
      };
    }
    default:
      return state;
  }
}

function getColor(letter, i, j, row) {
  if (!letter) return 'bg-white';
  if (i < row) {
    if (letter === ans[j]) {
      return 'bg-green-500';
    } else if (ans.includes(letter)) {
      return 'bg-yellow-500';
    } else {
      return 'bg-gray-500';
    }
  }
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const handleKeydown = (event) => {
      event.preventDefault();
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

  return (
    <div className="flex flex-col w-[350px] mx-auto mt-5">
      {state.array.map((row, i) => (
        <div key={i} className="flex justify-between mb-2">
          {row.map((cell, j) => {
            const bgcolor = getColor(cell, i, j, state.nowRow);
            return (
              <div
                key={j}
                className={`flex items-center justify-center border border-gray-300 w-[62px] h-[62px] text-base ${bgcolor}`}
              >
                {cell}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default App;
