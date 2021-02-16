import isAllowedMethod from '../utils/is-allowed-method'
import createApiHandler, {
  ShopifyApiHandler,
} from '../utils/create-api-handler'

import {
  SHOPIFY_CHECKOUT_ID_COOKIE,
  SHOPIFY_CHECKOUT_URL_COOKIE,
  SHOPIFY_CUSTOMER_TOKEN_COOKIE,
} from '@framework/const'

import { getConfig } from '..'
import associateCustomerWithCheckoutMutation from '@framework/utils/mutations/associate-customer-with-checkout'

const METHODS = ['GET']

const checkoutApi: ShopifyApiHandler<any> = async (req, res, config) => {
  if (!isAllowedMethod(req, res, METHODS)) return

  config = getConfig()

  const { cookies } = req
  const checkoutUrl = cookies[SHOPIFY_CHECKOUT_URL_COOKIE]

  try {
    await config.fetch(associateCustomerWithCheckoutMutation, {
      variables: {
        checkoutId: cookies[SHOPIFY_CHECKOUT_ID_COOKIE],
        customerAccessToken: cookies[SHOPIFY_CUSTOMER_TOKEN_COOKIE],
      },
    })
  } catch (error) {
    console.error(error)
  }

  if (checkoutUrl) {
    res.redirect(checkoutUrl)
  } else {
    res.redirect('/cart')
  }
}

export default createApiHandler(checkoutApi, {}, {})
