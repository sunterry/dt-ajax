const ajax = (params = {}) => {
	const { data } = params.data || {};
	const json = params.jsonp ? dtJsonp(params) : dtAjax(params);
};

function dtAjax(params) {
	// 默认为get请求， 并且转大写
	params.type = (params.type || 'GET').toUpperCase();
	// 避免有特殊字符，必须格式化传输数据
	params.data = formatParams(params.data);
	const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObjcet('Microsoft.XMLHTTP');
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			const status = xhr.status;
			if (status >= 200 && status < 300 || status === 304) {
				let response = '';
				// 判断接受数据的内容类型
				const type = xhr.getResponseHeader('Content-type');
				if (type.indexOf('xml') !== -1 && xhr.responseXML) {
					response = xhr.responseXML; // Document对象响应
				} else if(type.includes('application/json')) {
					response = JSON.parse(xhr.responseText); // JSON响应
				} else {
					response = xhr.responseText; // 字符串响应
				}
				params.success && params.success(response);
			}
			else params.error && params.error(status);
		}
	}
	if (params.type === 'GET') {
		xhr.open(params.type, params.url + '?' + params.data, true);
		xhr.send(null);
	} else {
		xhr.open(params.type, params.url, true);
		//必须，设置提交时的内容类型
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		// 传输数据
		xhr.send(params.data);
	}
}

function dtJsonp(params) {
	const callbackName = params.jsonp;
	const head = document.getElementsByTagName('head')[0];
	params.data['callback'] = callbackName;
	const data = formatParams(params.data);
	const script = document.createElement('script');
	head.appendChild(script);
	//创建jsonp回调函数
	window[callbackName] = function(json) {
		head.removeChild(script);
		clearTimeout(script.timer);
		window[callbackName] = null;
		params.success && params.success(json);
		script.src = params.url + '?' + data;
		if(params.time) {
			script.timer = setTimeout(function() {
				window[callbackName] = null;
				head.removeChild(script);
				params.error && params.error({
					message: '超时'
				});
			}, params.time);
		}
	};
}

function formatParams(data) {
	const arr = [];
	for(let name in data) {
		// encodeURIComponent() ：用于对 URI 中的某一部分进行编码
		arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
	}
	// 添加一个随机数参数，防止缓存
	arr.push('v=' + Math.floor(Math.random() * 10000 + 500));
	return arr.join('&');
}


ajax();
