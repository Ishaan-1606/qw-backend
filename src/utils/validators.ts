import { Request,Response,NextFunction } from "express";
import { body, ValidationChain, validationResult } from "express-validator";

export const validate = (validations:ValidationChain[])=>{
    return async (req:Request,res:Response,next:NextFunction) =>{
        for(let validation of validations){
            const result= await validation.run(req);
            if(!result.isEmpty()){
                break;
            }
        }
        const errors=validationResult(req);
        if(errors.isEmpty()){
            return next();
        }
        res.status(422).json({errors:errors.array()});
    };
}

export const loginValidator = [
    body("email").trim().isEmail().withMessage("email is required"),
    body("password").trim().isLength({min:6}).withMessage("password min length at least 6"),
]

export const signUpValidator = [
    body("name").notEmpty().withMessage("name is required"),
    ...loginValidator,
];

export const chatCompletionValidator = [
    body("message").notEmpty().withMessage("Message is required"),
  ];
  
