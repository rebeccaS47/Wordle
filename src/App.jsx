import { useEffect, useReducer } from 'react';

const rows = 6;
const cols = 5;

const initialState = {
  array: Array(rows)
    .fill()
    .map(() => Array(cols).fill('')),
  nowRow: 0,
  nowCol: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_LETTER': {
      if (state.nowCol >= cols) return state;
      const newArray = [...state.array];
      newArray[action.row][action.col] = action.letter.toUpperCase();
      return {
        ...state,
        array: newArray,
        nowCol: state.nowCol + 1,
      };
    }
    case 'REMOVE_LETTER': {
      if (state.nowCol <= 0) return state;
      const newArray = [...state.array];
      newArray[action.row][action.col - 1] = '';
      return {
        ...state,
        array: newArray,
        nowCol: state.nowCol - 1,
      };
    }
    case 'SUBMIT_GUESS': {
      return state;
    }
    default:
      return state;
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
            row: state.nowRow,
          });
          break;
        case 'Backspace':
          dispatch({
            type: 'REMOVE_LETTER',
            row: state.nowRow,
            col: state.nowCol,
          });
          break;
        default:
          if (/^[a-zA-Z]$/.test(event.key)) {
            dispatch({
              type: 'ADD_LETTER',
              letter: event.key,
              row: state.nowRow,
              col: state.nowCol,
            });
          }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [state.nowRow, state.nowCol]);

  return (
    <div
      className="flex flex-col"
      style={{
        width: '350px',
        margin: '20px auto 0px',
      }}
    >
      {state.array.map((row, i) => (
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
