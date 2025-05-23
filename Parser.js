const log = console.log;

class Lexer {
    static EOF = '?'
    constructor(exp) {
        this.tokens = this.tokenize(exp)
    }

    tokenize(exp) {
        const tokens = []
        for (const ch of exp) {
            if (/\s/.test(ch)) continue;
            switch (ch) {
                case '(':
                case ')':
                case '+':
                case '-':
                case '*':
                case '/':
                    tokens.push(ch)
                    break
                default:
                    tokens.push(Number(ch))
                    break
            }
        }
        return tokens
    }

    peekToken() {
        return this.tokens[0] ?? Lexer.EOF
    }

    getToken() {
        return this.tokens.shift() ?? Lexer.EOF
    }
}

const factor = lexer => {
    if (lexer.peekToken() === '(') {
        lexer.getToken()
        const exp = expression(lexer)
        lexer.getToken()
        return exp
    }
    return lexer.getToken()
}
const term = lexer => {
    let left = factor(lexer)
    while (lexer.peekToken() === '*' || lexer.peekToken() === '/') {
        const op = lexer.getToken()
        if (op === '*')
            left *= factor(lexer)
        else if (op === '/')
            left /= factor(lexer)
    }
    return left
}
const expression = lexer => {
    let left = term(lexer)
    while (lexer.peekToken() === '+' || lexer.peekToken() === '-') {
        const op = lexer.getToken()
        if (op === '+')
            left += term(lexer)
        else if (op === '-')
            left -= term(lexer)
    }
    return left
}

const parser = exp => {
    const lexer = new Lexer(exp)
    return expression(lexer)
}

;(_ => {
    const exp = '1-(2-4)*3'
    const value = parser(exp)
    log(value)
})()