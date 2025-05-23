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
                default:
                    tokens.push(ch)
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
    return exp
}

;(_ => {
    const exp = '\t 1 \n + 2'
    const value = parser(exp)
    log(value)
})()