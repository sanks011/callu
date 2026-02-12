import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'User ID required' }, { status: 400 });
    }

    // Prevent deleting admin users
    const user = await User.findById(id);
    if (user?.role === 'admin') {
      return NextResponse.json({ message: 'Cannot delete admin users' }, { status: 403 });
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
