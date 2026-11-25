import type { CSSProperties } from 'react';
import type { ProjectArt as Kind } from '../data';

/** Lightweight illustrated "screens" so each project card has a visual without screenshots. */
export function ProjectArt({ kind, hue }: { kind: Kind; hue: string }) {
  const style = { '--hue': hue } as CSSProperties;
  return (
    <div className={`art art--${kind}`} style={style} aria-hidden="true">
      <div className="art__glow" />
      {kind === 'erp' && (
        <div className="art__window art__window--erp">
          <div className="art__bar"><i /><i /><i /></div>
          <div className="erp">
            <div className="erp__nav">
              {['Invoices', 'Inventory', 'Accounts', 'Sales', 'Warranty', 'Reports'].map((m, i) => (
                <span key={m} className={i === 0 ? 'on' : ''}>{m}</span>
              ))}
            </div>
            <div className="erp__invoice">
              <div className="erp__head"><b>INV-2041</b><em>Tax invoice</em></div>
              {[
                ['Product A', '2 box', '₹ 4,800'],
                ['Product B', '12 pcs', '₹ 1,320'],
                ['Product C', '1 set', '₹ 9,500'],
              ].map(([n, q, v]) => (
                <div key={n} className="erp__row"><span>{n}</span><span>{q}</span><span>{v}</span></div>
              ))}
              <div className="erp__row erp__row--tax"><span>Tax 18%</span><span /><span>₹ 2,812</span></div>
              <div className="erp__total"><span>Total</span><b>₹ 18,432</b></div>
            </div>
            <div className="erp__side">
              <div className="erp__kpi"><em>Stock · units</em><b>box · pack · pc</b></div>
              <div className="erp__chart">
                {[38, 62, 45, 80, 58, 92, 70].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}
              </div>
              <div className="erp__claim">● Warranty claim approved</div>
            </div>
          </div>
        </div>
      )}
      {kind === 'insurance' && (
        <div className="art__window">
          <div className="art__bar"><i /><i /><i /></div>
          <div className="ins">
            {/* Workflow stepper */}
            <div className="ins__steps">
              {['Details', 'Coverage', 'Review', 'Policy'].map((st, i) => (
                <span key={st} className={i < 2 ? 'done' : i === 2 ? 'on' : ''}>
                  <b>{i < 2 ? '✓' : i + 1}</b>
                  {st}
                </span>
              ))}
            </div>
            <div className="ins__body">
              <div className="ins__form">
                <i /><i /><i className="short" />
                <em>Continue →</em>
              </div>
              <div className="ins__policy">
                <span>Takaful plan</span>
                <b>Comprehensive</b>
                <s />
              </div>
            </div>
          </div>
        </div>
      )}
      {kind === 'school' && (
        <div className="art__window">
          <div className="art__bar"><i /><i /><i /></div>
          <div className="school">
            <div className="school__classes">
              {['Toddlers', 'Nursery', 'KG 1', 'KG 2'].map((c, i) => (
                <span key={c} className={i === 1 ? 'on' : ''}>{c}</span>
              ))}
            </div>
            <div className="school__main">
              <div className="school__kids">
                {[1, 1, 1, 0, 1, 1, 1, 1].map((present, i) => (
                  <span key={i} className={present ? 'in' : ''} style={{ '--k': i } as CSSProperties} />
                ))}
              </div>
              <div className="school__msg">✉ Note sent to parents</div>
            </div>
          </div>
        </div>
      )}
      {kind === 'lms' && (
        <div className="art__window">
          <div className="art__bar"><i /><i /><i /></div>
          <div className="lms">
            {/* Lead list with stage pills */}
            <div className="lms__tasks">
              {[
                ['won', 'Lead · Dubai', 'Won'],
                ['live', 'Lead · Sharjah', 'Qualified'],
                ['', 'Lead · Abu Dhabi', 'Contacted'],
                ['', 'Lead · Ajman', 'New'],
              ].map(([s, t, stage]) => (
                <div key={t} className={`lms__task ${s}`}>
                  <b />
                  <span>{t}</span>
                  <em className="lms__pill">{stage}</em>
                </div>
              ))}
            </div>
            {/* Pipeline: leads per stage */}
            <div className="lms__courses">
              {[
                ['New', 100],
                ['Contacted', 72],
                ['Qualified', 46],
                ['Won', 24],
              ].map(([c, p]) => (
                <div key={c} className="lms__course">
                  <span>{c}</span>
                  <i><s style={{ width: `${p}%` }} /></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {kind === 'crm' && (
        <div className="art__window">
          <div className="art__bar"><i /><i /><i /></div>
          <div className="art__crm">
            <div className="art__side">{[0, 1, 2, 3, 4].map((i) => <b key={i} />)}</div>
            <div className="art__cols">
              {[3, 2, 4].map((n, c) => (
                <div key={c} className="art__col">
                  {Array.from({ length: n }).map((_, i) => <span key={i} />)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {kind === 'pwa' && (
        <div className="art__phone">
          <div className="art__notch" />
          {['done', 'done', 'live', '', ''].map((s, i) => (
            <div key={i} className={`art__task ${s}`}><em /><span /></div>
          ))}
        </div>
      )}
      {kind === 'faces' && (
        <div className="art__grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`art__photo ${i === 1 || i === 4 ? 'tagged' : ''}`}>
              <div className="art__face" />
            </div>
          ))}
        </div>
      )}
      {kind === 'qr' && (
        <div className="art__qrwrap">
          <div className="art__qr">
            {Array.from({ length: 49 }).map((_, i) => (
              <span key={i} className={[0, 1, 2, 7, 9, 14, 15, 16, 4, 5, 6, 11, 13, 18, 19, 20, 28, 29, 30, 35, 37, 42, 43, 44, 24, 10, 22, 26, 32, 38, 40, 46].includes(i) ? 'on' : ''} />
            ))}
          </div>
          <div className="art__receipt"><span /><span /><span /><b>Paid ✓</b></div>
        </div>
      )}
      {kind === 'slides' && (
        <div className="art__window">
          <div className="art__bar"><i /><i /><i /></div>
          <div className="art__slide">
            <div className="art__tissue" />
            <div className="art__pin" style={{ top: '30%', left: '38%' }} />
            <div className="art__pin" style={{ top: '58%', left: '62%' }} />
            <div className="art__comment"><span /><span /></div>
          </div>
        </div>
      )}
      {kind === 'factory' && (
        <div className="art__window">
          <div className="art__bar"><i /><i /><i /></div>
          <div className="art__chart">
            {[40, 65, 52, 80, 70, 92, 60].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}
          </div>
        </div>
      )}
    </div>
  );
}
