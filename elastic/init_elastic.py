import json
import requests

BASE_URL = 'http://localhost:9200/'
PRODUCTS_FN = '../data/products.json'
RECIPES_FN = '../data/recipes.json'


def put_into_elastic(fn):
    base_fn = fn.split('/')[-1].split('.')[0]
    fid = open(fn)
    spicy_json = json.load(fid)
    fid.close()
    spicy_keys = spicy_json.keys()
    for key in spicy_keys:
        r = requests.put(
            BASE_URL + base_fn + '/id/' + key + '?pretty',
            data=json.dumps(spicy_json[key]),
            headers={
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        )
        if r.status_code != 200 and r.status_code != 201:
            print(r.status_code)
            return


if __name__ == '__main__':
    put_into_elastic(PRODUCTS_FN)
    put_into_elastic(RECIPES_FN)
