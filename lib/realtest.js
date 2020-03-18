const fs = require('fs');
const path = require('path');
const mongo = require('mongodb');
const common = require('./common');

const start = async () => {
  const client = await mongo.connect('mongodb://127.0.0.1:27017/expresscart', { useUnifiedTopology: true });
  const products = client.db('expresscart').collection('products');
  const img = fs.readFileSync(path.join(__dirname, 'test.jpg'));
  const promises = [];
  for(let i = 1; i <= 100; i++){
    promises.push((async () => {
      const num = i;
      console.log(num);
      const result = await products.insertOne({
        productPermalink: `product-${num}`,
        productTitle: `product ${num}`,
        productPrice: '15.00',
        productDescription: `${num}`,
        productPublished: true,
        productTags: '',
        productOptions: null,
        productComment: false,
        productAddedDate: new Date(),
        productStock: null,
        productImage: null
      });
      const productPath = result.ops[0]._id.toString();
      const uploadDir = path.join('public/uploads', productPath);
      common.checkDirectorySync(uploadDir);
      await fs.promises.writeFile(path.join(uploadDir, `file-${num}`), img);
      await fs.promises.writeFile(path.join(uploadDir, `file-${num + 1}`), img);
      await fs.promises.writeFile(path.join(uploadDir, `file-${num + 2}`), img);
      await products.updateOne({ _id: result.ops[0]._id }, { $set: {
        productImage: path.join('/uploads', productPath, `file-${num}`)
      } }, { multi: false });
    })());
  }

  await Promise.all(promises);
};

start().then(() => {
  console.log('done');
  process.exit(1);
});
