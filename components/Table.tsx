import React from 'react';

export interface TableColumn<T> {
  header: string;
  accessor?: keyof T | ((row: T, index: number) => React.ReactNode);
  align?: 'left' | 'center' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  onRowClick?: (row: T, index: number) => void;
  hoverable?: boolean;
  striped?: boolean;
}

export default function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  hoverable = true,
  striped = false,
}: TableProps<T>) {
  return (
    <div style={{ width: '100%', overflowX: 'auto', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#FFFFFF', fontSize: '13.5px' }}>
        <thead>
          <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            {columns.map((col, idx) => (
              <th
                key={idx}
                style={{
                  padding: '12px 16px',
                  fontWeight: 700,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#374151',
                  textAlign: col.align || 'left',
                  ...col.style,
                }}
                className={col.className}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: '24px', textAlign: 'center', color: '#6B7280' }}>
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => {
              const bg = striped && rowIdx % 2 !== 0 ? '#F9FAFB' : '#FFFFFF';
              return (
                <tr
                  key={keyExtractor(row, rowIdx)}
                  onClick={() => onRowClick?.(row, rowIdx)}
                  style={{
                    background: bg,
                    borderBottom: '1px solid #F3F4F6',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={e => {
                    if (hoverable) e.currentTarget.style.background = '#F9FAFB';
                  }}
                  onMouseLeave={e => {
                    if (hoverable) e.currentTarget.style.background = bg;
                  }}
                >
                  {columns.map((col, colIdx) => {
                    let content: React.ReactNode;
                    if (typeof col.accessor === 'function') {
                      content = col.accessor(row, rowIdx);
                    } else if (col.accessor) {
                      content = String(row[col.accessor] ?? '');
                    } else {
                      content = null;
                    }
                    return (
                      <td
                        key={colIdx}
                        style={{
                          padding: '12px 16px',
                          color: '#475569',
                          textAlign: col.align || 'left',
                          ...col.style,
                        }}
                        className={col.className}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
