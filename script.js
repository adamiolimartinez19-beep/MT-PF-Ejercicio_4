const transiciones = {
    'q0': { '_': ['_', 'L', 'q4'], 'a': ['A', 'R', 'q1'], 'b': ['B', 'R', 'q2'], 'A': ['A', 'R', 'q0'], 'B': ['B', 'R', 'q0'] },
    'q1': { '_': ['B', 'L', 'q3'], 'b': ['B', 'L', 'q3'], 'a': ['a', 'R', 'q1'], 'A': ['A', 'R', 'q1'], 'B': ['B', 'R', 'q1'] },
    'q2': { 'a': ['A', 'L', 'q3'], '_': ['A', 'L', 'q3'], 'b': ['b', 'R', 'q2'], 'A': ['A', 'R', 'q2'], 'B': ['B', 'R', 'q2'] },
    'q3': { '_': ['_', 'R', 'q0'], 'a': ['a', 'L', 'q3'], 'b': ['b', 'L', 'q3'], 'A': ['A', 'L', 'q3'], 'B': ['B', 'L', 'q3'] },
    'q4': { 'A': ['a', 'L', 'q4'], 'B': ['b', 'L', 'q4'], '_': ['_', 'S', 'q5'], 'a': ['a', 'L', 'q4'], 'b': ['b', 'L', 'q4'] },
    'q5': {}
};

let pasos = [];

function simular() {
    const input = document.getElementById('cadena').value.trim();
    if (!/^[ab]*$/.test(input)) return alert('Solo a y b');

    pasos = [];
    document.getElementById('resultado').innerHTML = '';
    document.getElementById('pasos-lista').innerHTML = '';

    let cinta = ['_', ...input.split(''), '_'];
    let cabeza = 1;
    let estado = 'q0';

    const addPaso = () => {
        const izq = cinta.slice(0, cabeza).join('').replace(/_/g, '□');
        const act = cinta[cabeza] === '_' ? '□' : cinta[cabeza];
        const der = cinta.slice(cabeza + 1).join('').replace(/_/g, '□');
        pasos.push(`(${estado}, ${izq}<strong>${act}</strong>${der})`);
    };
    addPaso();
    mostrarCinta(cabeza, cinta);

    const intervalo = setInterval(() => {
        if (estado === 'q5') {
            clearInterval(intervalo);
            mostrarResultado(true, cinta);
            return;
        }

        const simbolo = cinta[cabeza];
        const trans = transiciones[estado][simbolo];
        if (!trans) {
            clearInterval(intervalo);
            mostrarResultado(false);
            return;
        }

        cinta[cabeza] = trans[0];
        if (trans[1] === 'R') { cabeza++; if (cabeza >= cinta.length) cinta.push('_'); }
        if (trans[1] === 'L') { cabeza--; if (cabeza < 0) { cinta.unshift('_'); cabeza = 0; } }

        estado = trans[2];
        addPaso();
        mostrarCinta(cabeza, cinta);
    }, 700);
}

function mostrarCinta(pos, cinta) {
    document.getElementById('cinta').innerHTML = cinta.map((c, i) =>
        `<span class="${i === pos ? 'cabeza' : ''}">${c === '_' ? '□' : c}</span>`
    ).join('');
}

function mostrarResultado(ok, cintaFinal) {
    const res = document.getElementById('resultado');
    res.className = ok ? 'resultado-final aceptada' : 'resultado-final rechazada';
    const final = cintaFinal.join('').replace(/_/g, '').trim();
    res.innerHTML = ok ? `ACEPTADA<br><small>Cinta final: <strong>${final || 'vacía'}</strong></small>` : 'RECHAZADA';
    
    setTimeout(() => {
        document.getElementById('pasos-lista').innerHTML = 
            pasos.map((p, i) => `<li style="animation-delay:${i*0.1}s">${p}</li>`).join('');
    }, 400);
}