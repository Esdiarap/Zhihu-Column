interface CheckCondition {
    format?: string[]
    size?: number // 以MB作为单位
}
type ErrorType = 'format' | 'size' | null
const uploadCheck = (file: File, condition: CheckCondition) => {
    const {format, size} = condition
    const isValidFormat = format ? format.includes(file.type) : true
    const isValidSize = size ? file.size / 1024 / 1024 < size : true
    let error: ErrorType = null
    if (!isValidFormat) error = 'format'
    if (!isValidSize) error = 'size'
    return {
        passed: isValidSize && isValidFormat,
        error
    }
}

export default uploadCheck
