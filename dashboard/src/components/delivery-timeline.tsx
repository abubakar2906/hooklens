import { cn, formatDate, formatDuration, statusCodeColor } from '@/lib/utils';
import { CheckCircle2, XCircle, Clock, Wifi } from 'lucide-react';
import type { Delivery } from '@/types';

interface DeliveryTimelineProps {
  deliveries: Delivery[];
}

export function DeliveryTimeline({ deliveries }: DeliveryTimelineProps) {
  if (deliveries.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-[#444444] text-sm">
        No delivery attempts yet
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {deliveries.map((delivery, idx) => {
        const isSuccess = delivery.status_code !== null && delivery.status_code >= 200 && delivery.status_code < 300;
        const isLast = idx === deliveries.length - 1;

        return (
          <div key={delivery.id} className="flex gap-4">
            {/* Timeline spine */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={cn(
                  'w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5',
                  isSuccess
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                )}
              >
                {isSuccess
                  ? <CheckCircle2 className="w-3.5 h-3.5" />
                  : delivery.status_code === null
                    ? <Wifi className="w-3.5 h-3.5" />
                    : <XCircle className="w-3.5 h-3.5" />
                }
              </div>
              {!isLast && (
                <div className="w-px flex-1 bg-[#1e1e1e] my-1" />
              )}
            </div>

            {/* Content */}
            <div className={cn('pb-4 flex-1', isLast && 'pb-0')}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white">
                      Attempt #{delivery.attempt_number}
                    </span>
                    {delivery.status_code !== null ? (
                      <span
                        className={cn(
                          'text-xs font-mono font-semibold px-1.5 py-0.5 rounded',
                          isSuccess ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        )}
                      >
                        HTTP {delivery.status_code}
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-zinc-500/10 text-zinc-400">
                        Network Error
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-[#555555]">
                      <Clock className="w-3 h-3" />
                      {formatDuration(delivery.duration_ms)}
                    </span>
                  </div>
                  {delivery.response_body && (
                    <p className="mt-1.5 text-xs text-[#555555] font-mono bg-[#111111] border border-[#1e1e1e] rounded-md px-2.5 py-1.5 max-w-prose truncate">
                      {delivery.response_body.slice(0, 200)}
                    </p>
                  )}
                </div>
                <span className="text-xs text-[#444444] flex-shrink-0 mt-0.5">
                  {formatDate(delivery.created_at)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
