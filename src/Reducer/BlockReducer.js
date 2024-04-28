
const blockInitialState = {
    number: 0,
    block: [],
    status: null
}

const blockReducer = (state = initialState, action ) => {
    switch ( action.type) {
        case 'ADD_BLOCK' :
            const newBlock = action.payload;
            const updatedBlockArray = [...state.block, newBlock];
            return {  status:'Succeed added a Block', number: number++ , block: updatedBlockArray };
        default:
            return state;
    }
}

export  { blockReducer , blockInitialState}