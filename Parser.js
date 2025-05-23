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

const parser = exp => {
    const lexer = new Lexer(exp)
    const factor = _ => lexer.getToken()
    const term = _ => {
        let left = factor()
        while (lexer.peekToken() === '*' || lexer.peekToken() === '/') {
            const op = lexer.getToken()
            if (op === '*')
                left *= factor()
            else if (op === '/')
                left /= factor()
        }
        return left
    }
    const expression = _ => {
        let left = term()
        while (lexer.peekToken() === '+' || lexer.peekToken() === '-') {
            const op = lexer.getToken()
            if (op === '+')
                left += term()
            else if (op === '-')
                left -= term()
        }
        return left
    }

    return expression(lexer)
}

;(_ => {
    const exp = '1-2-4*3'
    const value = parser(exp)
    log(value)
})()