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
    const expression = _ => {
        let left = factor()
        while (lexer.peekToken() === '+' || lexer.peekToken() === '-') {
            const op = lexer.getToken()
            if (op === '+')
                left += factor()
            else if (op === '-')
                left -= factor()
        }
        return left
    }

    return expression(lexer)
}

;(_ => {
    const exp = '\t 1 \n - 2-3-4'
    const value = parser(exp)
    log(value)
})()