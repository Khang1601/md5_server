import * as jwt from 'jsonwebtoken'

export const token = {
    createToken: (data: any, time: string): string => {
        let token = jwt.sign({...data}, process.env.JWT_KEY, {expiresIn: time})
        return token
    },
    decodeToken: (token: string): any => {
        try {
            let tokenData = jwt.verify(token, process.env.JWT_KEY)
            return tokenData
        }catch(err) {
            return false
        }
    }
}