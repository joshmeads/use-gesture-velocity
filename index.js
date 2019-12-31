import { useState, useEffect } from 'react';
import Impetus from 'impetus';

const errorMsg = err => {
  console.error(err);
  return null;
};

/**
 * @param {Element} ref - React node ref
 * @param {Number} initialPos - Initial position of impetus
 * @param {Func} update - Update function to add custom logic into the update function
 * @param {Object} config - Impetus override config
 */
export const useGestureVelocity = ({ ref, initialPos = 0, update, config = {} }) => {
  if (!ref) return errorMsg('[use-gesture-velocity] Missing ref');

  const [position, setPosition] = useState(initialPos);
  let impetus = null;

  const updatePosition = pos => {
    if (impetus) impetus.setValues(pos, 0);
    return setPosition(pos);
  };

  useEffect(() => {
    if (ref && ref.current && !impetus) {
      impetus = new Impetus({
        source: ref.current,
        initialValues: [initialPos, 0],
        update(x) {
          if (ref.current.offsetWidth === 0) return errorMsg('[use-gesture-velocity] Container width is 0');
          const pos = update ? update(x) : x;
          return setPosition(pos);
        },
        ...config,
      });
    }
    return () => {
      if (impetus) impetus = impetus.destroy();
    };
  }, [ref]);

  return [position, updatePosition];
};

export default useGestureVelocity;
