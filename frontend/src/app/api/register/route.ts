// src/app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Keypair } from 'stellar-sdk'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, phone } = body
    
    console.log('Received request:', { email, phone })

    const keypair = Keypair.random()
    const publicKey = keypair.publicKey()
    const secret = keypair.secret()
    
    console.log('Generated keypair:', { publicKey })

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        publicKey,
        secret,
      },
    })
    
    console.log('User created:', user)

    return NextResponse.json({ message: 'User created', user }, { status: 200 })
  } catch (error) {
    console.error('Error saving user:', error)
    return NextResponse.json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}