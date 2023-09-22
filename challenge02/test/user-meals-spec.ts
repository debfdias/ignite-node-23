import { execSync } from 'node:child_process'
import supertestRequest from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { knex } from '../src/database'

describe('Users/meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  const email = 'useremail@email.com'
  const name = 'username'
  const address = 'Random street'
  const weight = 72.5
  const height = 190

  it('should be able to create a new account', async () => {
    await supertestRequest(app.server)
      .post('/users')
      .send({
        name,
        email,
        address,
        weight,
        height,
      })
      .expect(201)
  })

  it('should be able to create a new meal', async () => {
    const createUserResponse = await supertestRequest(app.server)
      .post('/users')
      .send({
        name,
        email,
        address,
        weight,
        height,
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')

    const userId = await knex('users').select('id').where({ email })

    await supertestRequest(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Breakfast',
        description: 'Some description',
        isOnTheDiet: false,
      })
      .set('Cookie', cookies) 
      .expect(201)
  })

  it('should be able to list all meals', async () => {
    const createUserResponse = await supertestRequest(app.server)
      .post('/users')
      .send({
        name,
        email,
        address,
        weight,
        height,
      })

    const cookies = createUserResponse.get('Set-Cookie')

    const userId = await knex('users').select('id').where({ email })

    await supertestRequest(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Breakfast',
        description: 'description',
        isOnTheDiet: false,
      })
      .set('Cookie', cookies) 
    const listMealsResponse = await supertestRequest(app.server)
      .get('/meals')
      .set('Cookie', cookies) 
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'Breakfast',
        description: 'description',
      }),
    ])
  })

  it('should be able to get a specific meals', async () => {
    const createUserResponse = await supertestRequest(app.server)
      .post('/users')
      .send({
        name,
        email,
        address,
        weight,
        height,
      })

    const cookies = createUserResponse.get('Set-Cookie')

    const userId = await knex('users').select('id').where({ email })

    await supertestRequest(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Breakfast',
        description: 'Test',
        isOnTheDiet: false,
      })
      .set('Cookie', cookies) 

    const listMealsResponse = await supertestRequest(app.server)
      .get('/meals')
      .set('Cookie', cookies) 
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    const getMealResponse = await supertestRequest(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies) 
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Breakfast',
        description: 'Test',
      }),
    )
  })

  it('should be able to get the summary meals', async () => {
    const createUserResponse = await supertestRequest(app.server)
      .post('/users')
      .send({
        name,
        email,
        address,
        weight,
        height,
      })

    const cookies = createUserResponse.get('Set-Cookie')

    const userId = await knex('users').select('id').where({ email })

    await supertestRequest(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Meal1',
        description: 'Test',
        isOnTheDiet: false,
      })
      .set('Cookie', cookies)

    await supertestRequest(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Meal2',
        description: 'Test',
        isOnTheDiet: true,
      })
      .set('Cookie', cookies)

    await supertestRequest(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Meal3',
        description: 'Test',
        isOnTheDiet: false,
      })
      .set('Cookie', cookies)

    const summaryResponse = await supertestRequest(app.server)
      .get('/meals/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      'Meals': 3,
      'Correct meals': 1,
      'Wrong meals': 2,
    })
  })

  it('should be able to delete a specific meal', async () => {
    const createUserResponse = await supertestRequest(app.server)
      .post('/users')
      .send({
        name,
        email,
        address,
        weight,
        height,
      })

    const cookies = createUserResponse.get('Set-Cookie')

    const userId = await knex('users').select('id').where({ email })

    await supertestRequest(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Breakfast2',
        description: 'Test',
        isOnTheDiet: false,
      })
      .set('Cookie', cookies)

    const listMealsResponse = await supertestRequest(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await supertestRequest(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(202)
  })

  it('should be able to edit a meal', async () => {
    const createUserResponse = await supertestRequest(app.server)
      .post('/users')
      .send({
        name,
        email,
        address,
        weight,
        height,
      })

    const cookies = createUserResponse.get('Set-Cookie')

    const userId = await knex('users').select('id').where({ email })

    await supertestRequest(app.server)
      .post('/meals')
      .send({
        user_id: userId,
        name: 'Breakfast2',
        description: 'Test',
        isOnTheDiet: false,
      })
      .set('Cookie', cookies)

    const listMealsResponse = await supertestRequest(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await supertestRequest(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        user_id: userId,
        name: 'Breakfast2',
        description: 'Test',
        isOnTheDiet: true,
      })
      .expect(202)
  })
})
