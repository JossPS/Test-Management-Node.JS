import React from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export function PageContainer({ title, children, actions }: Props) {
  return (
    <div className="appPage">
      <div className="appContainer">
        <div className="appTop">
          <h1 className="appTitle">{title}</h1>

          {actions ? <div className="row">{actions}</div> : null}
        </div>

        <div className="appCard">{children}</div>
      </div>
    </div>
  );
}