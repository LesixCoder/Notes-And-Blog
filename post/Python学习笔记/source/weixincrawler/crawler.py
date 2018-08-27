# -*- coding: utf-8 -*-
__author__ = "liusixin"

import requests


def crawl():
    # url中的参数需要根据自己的情况做调整
    url = "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI3NzIzMDY0NA==&devicetype=iOS11.4&version=16070226&lang=zh_CN&nettype=WIFI&a8scene=0&fontScale=100&pass_ticket=rfXfA58CoZP3w7mmrmUKYwwYpkKv1gTf5Ah94UNX3QM%3D&wx_header=1"
 
    headers = """
Host: mp.weixin.qq.com
Cookie: wxtokenkey=777; devicetype=iOS11.4; lang=zh_CN; pass_ticket=rfXfA58CoZP3w7mmrmUKYwwYpkKv1gTf5Ah94UNX3QM=; rewardsn=; version=16070226; wap_sid2=CMjI334SXGhsdHQ0SXJIQ2pLd3pwX1lXM2JqZ0I0QzRWVTVYeE42V3VMMkdMSWdhMzAtU1E1Wm9QYlNfSVlFdXJsaTk5NkR0eF9Wa1IzWHc5a3ZNWlNsVHBkQTFNc0RBQUF+MJL5jtwFOA1AAQ==; wxuin=265806920; qb_qua=; Q-H5-GUID=81814eabe7844abea14dbe565419d466; qb_guid=81814eabe7844abea14dbe565419d466; pgv_pvid=2690240964; ts_uid=7925183391; pgv_pvi=1380191232; tvfe_boss_uuid=6a70b66a27c14bba; sd_cookie_crttime=1530870976037; sd_userid=38561530870976037' -H 'X-WECHAT-KEY: 3767cb09e3ac225ce84aa7408f8009c40ce09c4bc6ee9bd7fd79a4bb2134eaaa4d0f8c94a625318dfcdd2e63394b84a6ad7a8ea97ad86d44a4d77e4f7059c0d4c39d1e8294884726807a7cdd444b270c
X-WECHAT-KEY: 54320db02e367ad058a5c9cfdd9e4bf780c10666163fd5b8b030b1220c07f79c5775dfb1690eeea1f8f5b13c47ce09aacbd5c564f6c712d48af72c5bf015fd0dc326a0d734b8792b518ce9297fcb0540
X-WECHAT-UIN: MjY1ODA2OTIw
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F79 MicroMessenger/6.7.2 NetType/WIFI Language/zh_CN
Accept-Language: zh-cn
Accept-Encoding: gzip, deflate
Connection: keep-alive
    """
    headers = headers_to_dict(headers)
    response = requests.get(url, headers=headers, verify=False)
    print(response.text)
    if '<title>验证</title>' in response.text:
        raise Exception("获取微信公众号文章失败，可能是因为你的请求参数有误，请重新获取")
    data = extract_data(response.text)
    for item in data:
        print(item)


def extract_data(html_content):
    """
    从html页面中提取历史文章数据
    :param html_content 页面源代码
    :return: 历史文章列表
    """
    import re
    import html
    import json

    rex = "msgList = '({.*?})'"
    pattern = re.compile(pattern=rex, flags=re.S)
    match = pattern.search(html_content)
    if match:
        data = match.group(1)
        data = html.unescape(data)
        data = json.loads(data)
        articles = data.get("list")
        for item in articles:
            print(item)
        return articles


def headers_to_dict(headers):
    """
    将字符串
    '''
    Host: mp.weixin.qq.com
    Connection: keep-alive
    Cache-Control: max-age=
    '''
    转换成字典类型
    :param headers: str
    :return: dict
    """
    headers = headers.split("\n")
    d_headers = dict()
    for h in headers:
        h = h.strip()
        if h:
            k, v = h.split(":", 1)
            d_headers[k] = v.strip()
    return d_headers


if __name__ == '__main__':
    crawl()