class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""//The error.stack property is a string describing the point in the code at which the Error was instantiated.
    ){
        // overiding in class Error
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)// caputure no. off error in stack
        }

       

    }
}

export {ApiError}