function ajax (option = {}) {
  let { url, method, data, success, error, complete } = {
    url: option.url.trim(),
    method: option.method.trim(),
    data: option.data,
    success: option.success,
    error: option.error,
    complete: option.complete
  }

  const promise = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()

    // get请求
    if (method.toLowerCase() === 'get') {
      if (data && typeof data === 'object') {
        url = `${url}?`
        for (let k in data) {
          url += `${data[k]}&`
        }
      }
      xhr.open(method, url)
    }
    // post请求
    if (method.toLowerCase() === 'post') {
      xhr.open(method, url)
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
          resolve(xhr.responseText.trim())
        }
        reject('request error')
      }
    }

    if (method.toLowerCase() === 'get') {
      xhr.send()
    } else {
      let str = ''
      if (data && typeof data === 'object') {
        for (let k in data) {
          str += `${k}=${data[k]}&`
        }
      }
      str = str.replace(/&$/, '')
      xhr.send(str)
    }
  })

  promise.then(res => {
    success && success(res)
  }).catch(err => {
    error && error(err)
  }).finally(() => {
    complete && complete()
  })
}

// ajax({
//   url: 'www.baidu.com',
//   method: 'get',
//   data: {
//     name: '123',
//     age: 18
//   },
//   success (res) {
//     console.log('成功', res)
//   },
//   error (err) {
//     console.log('失败', err)
//   },
//   complete () {
//     console.log('完成')
//   }
// })
fetch('http://www.baidu.com', {
  method: 'get',
  mode: 'no-cors',
  data: {
    name: '123',
    age: 18
  }
}).then(res => {
  console.log('返回', res)
}).catch(err => {
  console.log('错误', err)
})
