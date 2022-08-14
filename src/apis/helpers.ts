interface TestProps {
    _id?: string
    name?: string
}
const testData:TestProps[] = [{_id: '1', name: 'abc'}, {_id: '2', name: 'def'}]
export const arrToObj = <T extends TestProps>(arr: Array<T>) =>
    arr.reduce((pre, cur) => {
        if (cur._id) pre[cur._id] = cur
        return pre
    }, {} as {[key: string]: T})
const result = arrToObj(testData)

const testObj: {[key: string]: TestProps} = {
    1: {_id: '1', name: 'lzh'},
    2: {_id: '2', name: 'dec'}
}

export const objToArr = <T>(obj: {[key: string]: T}) => Object.keys(obj).map(key => obj[key])

const result2 = objToArr(testObj)
