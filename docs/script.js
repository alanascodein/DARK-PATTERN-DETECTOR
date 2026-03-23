const patterns = [
    {
        name: 'Urgency',
        type: 'high-risk',
        regex: /(limited time only|offer ends (in|today|soon|tonight)|hurry|act now|don['']t miss out|expires? (in|soon|today)|last chance|final hours|(\d{1,2}:\d{2}:\d{2})|session will expire|account will (expire|be (deleted|suspended|deactivated)))/gi,
        explanation: 'Creates a false sense of a limited timeframe to pressure you into acting quickly without reading carefully.',
        score: 10
    },
    {
        name: 'Scarcity',
        type: 'high-risk',
        regex: /(only (\d+|a few|one|two|three) (left|remaining|available|in stock)|low in stock|selling fast|almost gone|limited (seats|spots|copies|availability)|high demand|going fast|nearly sold out|while (supplies|stock|they) last)/gi,
        explanation: 'Makes you believe a product or offer is in short supply to rush your decision.',
        score: 10
    },
    {
        name: 'Confirmshaming',
        type: 'high-risk',
        regex: /(no thanks,\s*i (don['']t want|hate|prefer not)|i (don['']t want to|hate) (saving|deals|discounts|protecting|updates|my data|a better|free)|i want to pay (full|more)|i prefer (a worse|less|no)|no,? i (don['']t|hate|want to miss out)|decline and (lose|miss|give up)|i (reject|refuse) (my|the) (discount|savings|protection|offer))/gi,
        explanation: 'Uses guilt or shame to discourage you from opting out by making the decline option sound foolish or self-harmful.',
        score: 15
    },
    {
        name: 'Forced Consent',
        type: 'high-risk',
        regex: /(by (using|continuing|visiting|accessing|scrolling|clicking|proceeding|browsing) (this |the )?(site|service|platform|app|page|website),?\s*you (agree|consent|accept|acknowledge)|continued use (of|constitutes)|your (continued) use is (deemed|considered) acceptance|use of this service constitutes)/gi,
        explanation: 'Forces you to agree to terms just by using the site — no explicit consent is collected.',
        score: 10
    },
    {
        name: 'Pre-selection',
        type: 'medium-risk',
        regex: /(pre-?selected (for you|by default)|we['']ve (signed|enrolled|opted|subscribed) you (in|up)|automatically (enrolled|opted in|subscribed|included)|you agree to (our|receive) (newsletter|marketing|promotional)|checked by default|already opted in|default(s)? to (on|enabled|yes))/gi,
        explanation: 'Automatically opts you into services or subscriptions without your explicit action.',
        score: 5
    },
    {
        name: 'Roach Motel',
        type: 'high-risk',
        regex: /(to (cancel|unsubscribe|opt out|delete your account|close your account).{0,80}(mail|send|call|contact|submit|log in|navigate|visit|fill|complete|allow \d+|days? for|business days?)|cancellation (takes? effect|is (subject to|processed)|may take)|no refunds? (are|will be) (issued|provided|given)|cancel (at least \d+ days?|before the (next|renewal)))/gi,
        explanation: 'Easy to sign up but cancellation is deliberately made difficult, time-consuming, or buried in steps.',
        score: 15
    },
    {
        name: 'Hidden Opt-out',
        type: 'high-risk',
        regex: /(opt.?out by (mailing|sending|writing|calling|submitting a (written|physical)|contacting us (at|via) (mail|post))|to (stop|remove yourself|unsubscribe).{0,60}(mail|written request|physical|letter|postal|allow \d+|days? (for|to) process)|written (request|notice) (to|within))/gi,
        explanation: 'Opt-out process is hidden or requires unreasonable effort like mailing a physical letter.',
        score: 15
    },
    {
        name: 'Data Harvesting',
        type: 'high-risk',
        regex: /(share (your|personal|user) (data|information) with (third.?part|partner|affiliate|advertis)|sell (anonymi[sz]ed|your|personal|user) (data|information)|data (broker|marketplace|partner)|build(ing)? (behavioural|behavioral|interest|user) profile|cross.?reference(d)? with third.?part|inferred (demographic|interest)|perpetual.{0,20}(license|right).{0,30}(content|data)|royalty.?free license to (use|reproduce|sell|distribute))/gi,
        explanation: 'Collects, shares, or sells your personal data or content, often buried in dense legal language.',
        score: 15
    },
    {
        name: 'Legalese Obfuscation',
        type: 'medium-risk',
        regex: /(hereinafter|herein|thereof|notwithstanding|pursuant to|in perpetuity|irrevocable|sublicensable|indemnify|indemnification|at (our|its) sole discretion|as determined (solely )?by|without (prior )?notice|without limitation|including but not limited to|to the fullest extent (permitted|allowed)|continued on page \d+|full agreement available upon (written )?request)/gi,
        explanation: 'Uses overly complex legal language to obscure what you are actually agreeing to.',
        score: 5
    },
    {
        name: 'Arbitration Trap',
        type: 'high-risk',
        regex: /(binding arbitration|waive (your right|the right) to (a jury|jury trial|class.?action|participate in class)|class.?action (waiver|lawsuit|proceeding)|arbitration (clause|agreement|shall govern)|individual arbitration|disputes? (shall|must|will) be (resolved|settled) (by|through|via) (binding )?arbitration|seat of (the )?arbitration)/gi,
        explanation: "Strips your right to sue in court or join class-action lawsuits, forcing private arbitration on the company's terms.",
        score: 20
    },
    {
        name: 'Auto-renewal Trap',
        type: 'medium-risk',
        regex: /(auto(matically)?-?renew(s|ed|al)?|renews? automatically|billed (automatically|monthly|annually|yearly) unless (cancelled|canceled)|subscription (continues|renews)|recurring (charge|billing|payment)|will be charged (automatically|unless)|unless (you )?cancel)/gi,
        explanation: 'Subscription renews automatically and charges you unless you remember to cancel in time.',
        score: 10
    },
    {
        name: 'Jurisdiction Manipulation',
        type: 'medium-risk',
        regex: /(jurisdiction of (our|the company)['']?s? choosing|laws? of (the state of|delaware|cayman|british virgin|nevada).{0,20}(govern|apply|shall apply)|governing law|venue (shall be|is) (in|the)|courts? of (delaware|cayman|nevada)|registered (address|office) in)/gi,
        explanation: 'Forces legal disputes to be handled in a distant or company-friendly jurisdiction, making it impractical for you to seek legal recourse.',
        score: 10
    }
];


/* ── DOM refs ── */
const textInput          = document.getElementById('text-input');
const analyzeButton      = document.getElementById('analyze-button');
const clearButton        = document.getElementById('clear-button');
const summaryContainer   = document.getElementById('summary-container');
const patternsContainer  = document.getElementById('patterns-container');
const highlightedOutput  = document.getElementById('highlighted-output');


/* ── Events ── */
analyzeButton.addEventListener('click', handleAnalysis);
clearButton.addEventListener('click', clearAll);


/* ── Main analysis ── */
function handleAnalysis() {
    const text = textInput.value.trim();
    if (!text) {
        alert('Please paste some text to analyze.');
        return;
    }

    summaryContainer.innerHTML  = '';
    patternsContainer.innerHTML = '';
    highlightedOutput.innerHTML = '';

    let totalScore    = 0;
    let foundPatterns = [];          // one entry per match (may have duplicates by name)
    let highlightedText = text;

    patterns.forEach(pattern => {
        const matches = [...text.matchAll(pattern.regex)];

        if (matches.length > 0) {
            matches.forEach(match => {
                foundPatterns.push({ ...pattern, snippet: match[0] });
                totalScore += pattern.score;
            });

            highlightedText = highlightedText.replace(
                pattern.regex,
                `<span class="highlight ${pattern.name.toLowerCase().replace(/\s+/g, '-')}">$&</span>`
            );
        }
    });

    displaySummary(totalScore, foundPatterns);
    displayHighlightedText(highlightedText);
    displayPatternCards(foundPatterns);
    displayScoreBreakdown(foundPatterns);
}


/* ── Summary banner ── */
function displaySummary(score, foundPatterns) {
    let riskLevel, title, message, emoji;

    if (score === 0) {
        riskLevel = 'low-risk';
        title     = 'Clean — No Patterns Detected';
        message   = 'This text shows no signs of manipulative language.';
        emoji     = '✅';
    } else if (score <= 10) {
        riskLevel = 'low-risk';
        title     = 'Low Risk';
        message   = 'Minor signs of persuasive language. Generally safe, but stay alert.';
        emoji     = '🟢';
    } else if (score <= 30) {
        riskLevel = 'medium-risk';
        title     = 'Medium Risk';
        message   = 'Noticeable manipulative patterns present. Read carefully before agreeing.';
        emoji     = '🟡';
    } else if (score <= 60) {
        riskLevel = 'high-risk';
        title     = 'High Risk';
        message   = 'Multiple dark patterns detected. This text is designed to manipulate you.';
        emoji     = '🔴';
    } else {
        riskLevel = 'high-risk';
        title     = 'Extremely High Risk';
        message   = 'Severe dark pattern usage. Strongly reconsider agreeing to this.';
        emoji     = '🚨';
    }

    const uniqueCount = new Set(foundPatterns.map(p => p.name)).size;

    summaryContainer.innerHTML = `
        <div class="summary-card ${riskLevel}">
            <div class="summary-top">
                <span class="summary-emoji">${emoji}</span>
                <div>
                    <h2>${title}</h2>
                    <p class="summary-message">${message}</p>
                </div>
                <div class="summary-score-badge">
                    <span class="score-number">${score}</span>
                    <span class="score-label">risk score</span>
                </div>
            </div>
            <div class="summary-stats">
                <div class="stat">
                    <span class="stat-value">${foundPatterns.length}</span>
                    <span class="stat-label">total matches</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${uniqueCount}</span>
                    <span class="stat-label">pattern types</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${foundPatterns.filter(p => p.type === 'high-risk').length}</span>
                    <span class="stat-label">high-risk hits</span>
                </div>
            </div>
        </div>
    `;
}


/* ── Highlighted text output ── */
function displayHighlightedText(html) {
    highlightedOutput.innerHTML = html || '<p class="placeholder">Nothing to show.</p>';
}


/* ── Pattern cards ── */
function displayPatternCards(foundPatterns) {
    if (foundPatterns.length === 0) {
        patternsContainer.innerHTML = '<p class="no-patterns">No specific dark patterns were detected.</p>';
        return;
    }

    // Group by pattern name, collect all snippets
    const grouped = new Map();
    foundPatterns.forEach(p => {
        if (!grouped.has(p.name)) {
            grouped.set(p.name, { ...p, snippets: [] });
        }
        grouped.get(p.name).snippets.push(p.snippet);
    });

    let html = '';
    grouped.forEach(pattern => {
        const snippetItems = pattern.snippets
            .slice(0, 3)                              // cap at 3 snippets per card
            .map(s => `<li class="snippet-item">"${escapeHtml(s)}"</li>`)
            .join('');

        const moreCount = pattern.snippets.length - 3;
        const moreNote  = moreCount > 0
            ? `<li class="snippet-more">+${moreCount} more match${moreCount > 1 ? 'es' : ''}</li>`
            : '';

        const riskBadge = pattern.type === 'high-risk'
            ? '<span class="badge badge-high">High Risk</span>'
            : '<span class="badge badge-medium">Medium Risk</span>';

        html += `
            <div class="pattern-card ${pattern.type}">
                <div class="pattern-card-header">
                    <div class="pattern-title-row">
                        <h4>${pattern.name}</h4>
                        ${riskBadge}
                    </div>
                    <span class="pattern-score">+${pattern.score} pts each</span>
                </div>
                <p class="pattern-explanation">${pattern.explanation}</p>
                <div class="snippets-section">
                    <p class="snippets-label">Found in text:</p>
                    <ul class="snippets-list">
                        ${snippetItems}
                        ${moreNote}
                    </ul>
                </div>
            </div>
        `;
    });

    patternsContainer.innerHTML = html;
}


/* ── Score breakdown table ── */
function displayScoreBreakdown(foundPatterns) {
    if (foundPatterns.length === 0) return;

    // Aggregate score per pattern name
    const breakdown = new Map();
    foundPatterns.forEach(p => {
        if (!breakdown.has(p.name)) {
            breakdown.set(p.name, { type: p.type, count: 0, perHit: p.score, total: 0 });
        }
        const entry = breakdown.get(p.name);
        entry.count++;
        entry.total += p.score;
    });

    let rows = '';
    breakdown.forEach((data, name) => {
        const rowClass = data.type === 'high-risk' ? 'row-high' : 'row-medium';
        rows += `
            <tr class="${rowClass}">
                <td>${name}</td>
                <td class="td-center">${data.count}</td>
                <td class="td-center">${data.perHit}</td>
                <td class="td-right score-cell">+${data.total}</td>
            </tr>
        `;
    });

    const totalScore = [...breakdown.values()].reduce((sum, d) => sum + d.total, 0);

    const breakdownEl = document.getElementById('breakdown-container');
    if (!breakdownEl) return;   // only render if the element exists in your HTML

    breakdownEl.innerHTML = `
        <div class="breakdown-card">
            <h3 class="breakdown-title">Score Breakdown</h3>
            <table class="breakdown-table">
                <thead>
                    <tr>
                        <th>Pattern</th>
                        <th class="td-center">Matches</th>
                        <th class="td-center">Per Hit</th>
                        <th class="td-right">Score</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
                <tfoot>
                    <tr class="total-row">
                        <td colspan="3">Total Risk Score</td>
                        <td class="td-right score-cell">${totalScore}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
}


/* ── Clear all ── */
function clearAll() {
    textInput.value              = '';
    summaryContainer.innerHTML   = '';
    patternsContainer.innerHTML  = '';
    highlightedOutput.innerHTML  = '<p class="placeholder">Your analyzed text will appear here...</p>';

    const breakdownEl = document.getElementById('breakdown-container');
    if (breakdownEl) breakdownEl.innerHTML = '';
}


/* ── Utility ── */
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}