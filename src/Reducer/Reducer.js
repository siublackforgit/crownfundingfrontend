
const initialState = {
    status: null,
    signer: null,
    contract: null
}

const reducer = (state = initialState, action ) => {
    switch ( action.type) {
        case 'GET_SIGNER' :
            return { ...state , status:'Succeed Signer', signer:action.payload};
        case 'GET_CONTRACT' :
            return { ...state , status:'Succeed Contract' , contract:action.payload};
        default:
            return state;
    }
}

export  { reducer , initialState}