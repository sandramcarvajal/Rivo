/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Modal que muestra cuando la sesión expira por inactividad
 */
export const SessionExpiredModal: React.FC = () => {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      role="alertdialog"
      aria-labelledby="session-expired-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full mx-4 p-8 animate-in fade-in duration-300 border border-slate-200">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-red-100 p-3 rounded-full shadow-sm">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 id="session-expired-title" className="text-xl font-semibold text-slate-900">
              Sesión expirada
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Tu sesión ha terminado por inactividad. Serás redirigido al login automáticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
