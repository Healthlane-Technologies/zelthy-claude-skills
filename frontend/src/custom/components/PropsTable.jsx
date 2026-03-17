import React from 'react';

const TypeBadge = ({ type }) => {
  const colorMap = {
    string: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    boolean: 'bg-amber-50 text-amber-700 border-amber-200',
    number: 'bg-blue-50 text-blue-700 border-blue-200',
    function: 'bg-violet-50 text-violet-700 border-violet-200',
    object: 'bg-rose-50 text-rose-700 border-rose-200',
    ReactNode: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    array: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  const baseType = Object.keys(colorMap).find(k => type.toLowerCase().includes(k.toLowerCase()));
  const colors = colorMap[baseType] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <code className={`text-[11px] px-1.5 py-0.5 rounded-md border font-mono ${colors}`}>
      {type}
    </code>
  );
};

const PropsTable = ({ props: propsList }) => {
  return (
    <div className="my-6 rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm props-table">
        <thead>
          <tr className="bg-gray-50/80">
            <th className="px-4 py-3 text-gray-500 font-semibold border-b border-gray-200 w-[180px]">Prop</th>
            <th className="px-4 py-3 text-gray-500 font-semibold border-b border-gray-200 w-[140px]">Type</th>
            <th className="px-4 py-3 text-gray-500 font-semibold border-b border-gray-200 w-[100px]">Default</th>
            <th className="px-4 py-3 text-gray-500 font-semibold border-b border-gray-200">Description</th>
          </tr>
        </thead>
        <tbody>
          {propsList.map((prop, i) => (
            <tr
              key={prop.name}
              className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'} hover:bg-indigo-50/30 transition-colors`}
            >
              <td className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <code className="text-[13px] font-mono font-semibold text-gray-900">{prop.name}</code>
                  {prop.required && (
                    <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1 py-0.5 rounded uppercase tracking-wider">
                      req
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 border-b border-gray-100">
                <TypeBadge type={prop.type} />
              </td>
              <td className="px-4 py-3 border-b border-gray-100">
                {prop.default !== undefined ? (
                  <code className="text-xs font-mono text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                    {String(prop.default)}
                  </code>
                ) : (
                  <span className="text-xs text-gray-400">-</span>
                )}
              </td>
              <td className="px-4 py-3 border-b border-gray-100 text-gray-600 text-[13px] leading-relaxed">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropsTable;
