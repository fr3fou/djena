import { jsonValue } from "./json.ts"

function main() {
  let obj = jsonValue()(
    `[{"id":1,"name":"Burgers","image":"https://www.tasteofhome.com/wp-content/uploads/2017/10/exps28800_UG143377D12_18_1b_RMS-696x696.jpg"},{"id":2,"name":"Soups","image":"https://www.fifteenspatulas.com/wp-content/uploads/2016/02/Chicken-Noodle-Soup-Fifteen-Spatulas-2.jpg"},{"id":3,"name":"Desserts","image":"https://img.taste.com.au/K1S-jtpM/taste/2016/11/top-50-desserts-117787-1.jpeg"},{"id":4,"name":"Meat","image":"https://be35832fa5168a30acd6-5c7e0f2623ae37b4a933167fe83d71b5.ssl.cf3.rackcdn.com/963/slow-cooked-topside-beef-in-red-wine__square.jpg"},{"id":5,"name":"Alcohol","image":"https://www.ucsf.edu/sites/default/files/styles/2014_inline_5-col/public/fields/field_insert_file/news/alcohol-pouring-into-glass.jpg?itok=hm0eROVd"},{"id":6,"name":"Drinks","image":"https://cdn2.rsc.org.uk/sitefinity/images/catering/social-images/cocktails-in-the-rooftop-restaurant-bar.tmb-gal-1340.jpg?sfvrsn=1dea0321_1"},{"id":7,"name":"Fast Food","image":"https://cdn1.medicalnewstoday.com/content/images/articles/317/317122/junk-food.jpg"},{"id":8,"name":"Seafood","image":"https://d2814mmsvlryp1.cloudfront.net/wp-content/uploads/2017/12/110517_WGC_PAELLA_PARTY-_1181.jpg"},{"id":9,"name":"Salads","image":"https://img.taste.com.au/eWkJouak/w720-h480-cfill-q80/taste/2016/11/warm-thai-coconut-and-lemongrass-salad-97453-1.jpeg"}]`
  )
  console.log(JSON.stringify(obj))
}

main()
