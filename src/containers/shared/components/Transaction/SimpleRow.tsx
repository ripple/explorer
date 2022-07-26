import React from 'react';

export type SimpleRowProps = React.PropsWithChildren<{
  className?: string;
  label: string;
}>;

export const SimpleRow = (props: SimpleRowProps) => {
  const { label, children } = props;
  return (
    <div className="row">
      <div className="label">{label}</div>
      <div className="value">{children}</div>
    </div>
  );
};
