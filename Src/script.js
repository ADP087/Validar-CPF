const formulario = document.querySelector('#form');
const inputCPF = document.querySelector('#input-cpf');

//===========================================================

function ValidaCPF(cpfEnviado) {
    Object.defineProperty(this, 'cpfLimpo', {
        get: function() {
            return cpfEnviado.replace(/\D+/g, '');
        }
    });
}

ValidaCPF.prototype.valida = function() {
    if(typeof this.cpfLimpo === 'undefined') return false;
    if(this.cpfLimpo.length !== 11) return false;
    if(this.isSequencia()) return false;

    const cpfParcial = this.cpfLimpo.slice(0, -2);
    const digito1 = this.criaDigito(cpfParcial);
    const digito2 = this.criaDigito(cpfParcial + digito1);

    const novoCPF = cpfParcial + digito1 + digito2;

    return novoCPF === this.cpfLimpo;
};

ValidaCPF.prototype.criaDigito = function(cpfParcial) {
    const cpfArray = Array.from(cpfParcial);

    let regressivo = cpfArray.length + 1;
    const total = cpfArray.reduce((ac, val) => {
        ac += (regressivo * Number(val));
        regressivo--;

        return ac;
    }, 0);

    const digito = 11 - (total % 11);

    return digito > 9 ? 0 : digito;
}

ValidaCPF.prototype.isSequencia = function() {
    const sequencia = this.cpfLimpo[0].repeat(this.cpfLimpo.length);

    return sequencia === this.cpfLimpo;
}

//===== ADICIONANDO EVENTOS

inputCPF.addEventListener('input', () => {
    let value = inputCPF.value;

    // remove tudo que não for número
    value = value.replace(/\D/g, '');

    // adiciona os pontos e o traço
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    inputCPF.value = value;
});

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const resultado = document.querySelector('.resultado');

    resultado.innerHTML = '';
    resultado.classList.remove('vazio', 'good', 'bad');

    if(!inputCPF.value) {
        resultado.classList.add('vazio');

        return resultado.innerHTML = '<p>Digite um CPF</p>';
    }
    
    const cpf = new ValidaCPF(inputCPF.value);

    if(cpf.valida()) {
        resultado.classList.add('good');

        resultado.innerHTML = '<p>CPF Válido</p>';
    } else {
        resultado.classList.add('bad');

        resultado.innerHTML = '<p>CPF Inválido</p>';
    }
});