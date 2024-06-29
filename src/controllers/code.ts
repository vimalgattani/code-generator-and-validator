import { Request, Response } from "express";
import { GeneratedCode } from "../interfaces";
import { generateCode, getGeneratedCode, validateCode } from "../models/code";
import { getRandomGeneratedCode } from "../utils/index"
import _ from "lodash";

export const initiate = async (req: Request, res: Response): Promise<Response> => {
    const {email} = req.body;
    const code = getRandomGeneratedCode();
    await generateCode(email, code);
    return res.send({
        email,
        code
    });
}

export const validate = async (req: Request, res: Response): Promise<Response> => {
    const {email, code} = req.body;
    const generatedCode: GeneratedCode | undefined = await getGeneratedCode(email);
    if(_.isEmpty(generatedCode)) {
        return res.send({
            validation: 'FAILED',
            message: 'No code generated, yet.',
        })
    }
    if(generatedCode.code != code) {
        return res.send({
            validation: 'FAILED',
            message: 'Incorrect code',
        })
    }
    if(generatedCode.is_validated) {
        return res.send({
            validation: 'FAILED',
            message: 'Illegal request, code already verified.',
        })
    }
    const currentTimeinMillis = Date.now();
    const currentEpochSeconds = Math.floor(currentTimeinMillis / 1000);
    if(currentEpochSeconds > generatedCode.valid_till) {
        return res.send({
            validation: 'FAILED',
            message: 'Code expired, please try again',
        })
    }
    await validateCode(email);
    return res.send({
        validation: 'SUCCESS',
        message: 'Code Validated!',
    })
}