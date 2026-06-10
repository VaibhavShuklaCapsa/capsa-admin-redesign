import { useCallback } from "react";

export function useFormattedNumber(value, setValue) {
  const format = (num) =>
    num !== "" && !isNaN(Number(num))
      ? Number(num).toLocaleString()
      : "";

  const raw = value.replace(/,/g, "");

  const onChange = useCallback(
    (e) => {
      const input = e.target.value.replace(/,/g, "");

      if (input === "") {
        setValue("");
        return;
      }

      if (!isNaN(Number(input))) {
        setValue(format(input));
      }
    },
    [setValue]
  );

  return {
    formatted: value,
    raw,
    onChange,
  };
}
