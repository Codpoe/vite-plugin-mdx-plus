import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <>
      <div className="text-green-500">Demo example</div>
      <div>
        <button onClick={() => setCount(count - 1)}>-</button>
        <span>{count}</span>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
    </>
  );
}
