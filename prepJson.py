
import pandas as pd
for f in ['gear','inscriptions','weapons','components','support','sigils']:
    df = pd.read_csv('./src/assets/{}.csv'.format(f))
    df.to_json('./src/assets/{}.json'.format(f), orient='records')
