# Parses text like "Make recipes with a, b, c, and d", then prints "[a,b,c,d]"
from sys import argv

if __name__ == '__main__':
    if len(argv) != 2:
        print('[USAGE]: %s <text to parse>' % argv[0])
        exit(-1)
    text = argv[1]
    # here comes the magic
    print(argv[1].split('with')[1].strip().replace(',', '').replace('and ', '').split(' '))
    
        
