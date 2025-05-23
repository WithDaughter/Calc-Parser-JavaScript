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

class Parser {
    constructor(exp) {
        this.lexer = new Lexer(exp)
    }

    factor(){
        if (this.lexer.peekToken() === '(') {
            this.lexer.getToken()
            const exp = this.expression()
            this.lexer.getToken()
            return exp
        }
        return this.lexer.getToken()
    }

    term() {
        let left = this.factor()
        while (this.lexer.peekToken() === '*' || this.lexer.peekToken() === '/') {
            const op = this.lexer.getToken()
            if (op === '*')
                left *= this.factor()
            else if (op === '/')
                left /= this.factor()
        }
        return left
    }

    expression() {
        let left = this.term()
        while (this.lexer.peekToken() === '+' || this.lexer.peekToken() === '-') {
            const op = this.lexer.getToken()
            if (op === '+')
                left += this.term()
            else if (op === '-')
                left -= this.term()
        }
        return left
    }
}

const calc = exp => {
    const parser = new Parser(exp)
    return parser.expression()
}

;(_ => {
    const exp = '1-(2-((2*2 -1) +1))*3'
    const value = calc(exp)
    log(value)
})()