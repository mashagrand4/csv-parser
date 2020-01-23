const getUrlParams = (url) => {
    let paramsArray = url.split('?');
    let result= {};
    if(paramsArray.length >= 2){
        paramsArray[1].split('&').forEach((item)=>{
            try {
                result[item.split('=')[0]] = item.split('=')[1];
            } catch (e) {
                result[item.split('=')[0]] = '';
            }
        })
    }
    return result;
};

export default getUrlParams;