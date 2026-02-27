import React from 'react';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AuthContainer({ title, subtitle, children }: Props) {
   return (
    <div className="authPage">
      <div className="authCard">
        <header className="authHeader">
          <h1 className="authTitle">{title}</h1>
          {subtitle && <p className="authSubtitle">{subtitle}</p>}
        </header>

        {children}
      </div>
    </div>
  );
}