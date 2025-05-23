const log = console.log;

class Lexer {
    static EOF = '?'
    constructor(exp) {
        this.tokens = this.tokenize(exp)
    }

    tokenize(exp) {
        const isNum = ch => ch >= '0' && ch <= '9'
        const tokens = []
        let cur = 0
        while (cur < exp.length) {
            let ch = exp[cur++]
            if (/\s/.test(ch)) continue;
            switch (ch) {
                case '(':
                case ')':
                case '+':
                case '-':
                case '/':
                    tokens.push(ch)
                    break
                case '*':
                    if (exp[cur] === '*') {
                        cur++
                        tokens.push('**')
                    } else
                        tokens.push(ch)
                    break
                default:
                    if (isNum(ch)) {
                        let num = ch
                        while (isNum(exp[cur]))
                            num += exp[cur++]
                        if (exp[cur] !== '.') {
                            tokens.push(Number(num))
                            break
                        }
                        num += exp[cur++]
                        while (isNum(exp[cur]))
                            num += exp[cur++]
                        tokens.push(Number(num))
                    } else
                        throw new Error(`${ch} is not a number`)
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
        if (this.lexer.peekToken() === '-') {
            this.lexer.getToken()
            return -(this.lexer.getToken())
        } else
            return this.lexer.getToken()
    }

    secondary() {
        let left = this.factor()
        while (this.lexer.peekToken() === '**') {
            this.lexer.getToken()
            left = Math.pow(left, this.factor())
        }
        return left
    }

    term() {
        let left = this.secondary()
        while (this.lexer.peekToken() === '*' || this.lexer.peekToken() === '/') {
            const op = this.lexer.getToken()
            if (op === '*')
                left *= this.secondary()
            else if (op === '/')
                left /= this.secondary()
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
    const exp = '2**3*2**3'
    const value = calc(exp)
    log(value)
})()