const Product = require('../models/product');
const POKEMONS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1; //the current page
  let total;

  Product.find()
  .countDocuments()
  .then(numberOfPokemons => {
    total = numberOfPokemons;
    return Product.find()
      .skip((page - 1) * POKEMONS_PER_PAGE)
      .limit(POKEMONS_PER_PAGE);
    })
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All wild pokemons',
        path: '/products',
        currentPage: page,
        hasNextPage: POKEMONS_PER_PAGE * page < total,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page -1,
        lastPage: Math.ceil(total / POKEMONS_PER_PAGE)
      })
    })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
};

//in combination with skip, limit and pagecount from mongodb
exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1; //the current page
  let total;

  Product.find()
  .countDocuments()
  .then(numberOfPokemons => {
    total = numberOfPokemons;
    return Product.find()
      .skip((page - 1) * POKEMONS_PER_PAGE)
      .limit(POKEMONS_PER_PAGE);
    })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: POKEMONS_PER_PAGE * page < total,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page -1,
        lastPage: Math.ceil(total / POKEMONS_PER_PAGE)
      })
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  
    req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      console.log(user);
      const products = user.cart.items || 0;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Party',
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.postParty = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(product => {
    return req.user.addToParty(product);
  })
  .then(results => {
    res.redirect('/cart');
  });
};

exports.postPartyRemovePokemon = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.removeFromParty(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};
