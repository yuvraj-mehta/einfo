const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

/**
 * Cleanup admin activity logs to keep only the 10 most recent entries
 * This script helps reduce database storage usage
 */
async function cleanupAdminActivities() {
  try {
    console.log('🧹 Starting admin activity logs cleanup...');

    // Count total activities before cleanup
    const totalActivitiesBefore = await prisma.adminActivityLog.count();
    console.log(`📊 Current admin activities in database: ${totalActivitiesBefore}`);

    if (totalActivitiesBefore <= 10) {
      console.log('✅ No cleanup needed. Activities are already within the limit of 10.');
      return {
        success: true,
        message: 'No cleanup needed',
        totalBefore: totalActivitiesBefore,
        totalAfter: totalActivitiesBefore,
        deleted: 0
      };
    }

    // Get the IDs of the 10 most recent activities to keep
    const activitiesToKeep = await prisma.adminActivityLog.findMany({
      select: { id: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const idsToKeep = activitiesToKeep.map(activity => activity.id);

    // Delete all activities except the 10 most recent
    const deleteResult = await prisma.adminActivityLog.deleteMany({
      where: {
        id: {
          notIn: idsToKeep
        }
      }
    });

    const totalActivitiesAfter = await prisma.adminActivityLog.count();
    const deletedCount = deleteResult.count;

    console.log('✅ Cleanup completed successfully!');
    console.log(`📊 Activities before cleanup: ${totalActivitiesBefore}`);
    console.log(`📊 Activities after cleanup: ${totalActivitiesAfter}`);
    console.log(`🗑️  Activities deleted: ${deletedCount}`);
    console.log(`💾 Storage saved by removing ${deletedCount} activity records`);

    logger.info('Admin activity cleanup completed', {
      totalBefore: totalActivitiesBefore,
      totalAfter: totalActivitiesAfter,
      deleted: deletedCount
    });

    return {
      success: true,
      message: 'Cleanup completed successfully',
      totalBefore: totalActivitiesBefore,
      totalAfter: totalActivitiesAfter,
      deleted: deletedCount
    };

  } catch (error) {
    console.error('❌ Failed to cleanup admin activities:', error.message);
    logger.error('Admin activity cleanup failed', {
      error: error.message,
      stack: error.stack
    });
    
    return {
      success: false,
      message: 'Cleanup failed',
      error: error.message
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script if called directly
if (require.main === module) {
  cleanupAdminActivities()
    .then((result) => {
      if (result.success) {
        console.log('🎉 Cleanup process completed successfully!');
        process.exit(0);
      } else {
        console.error('💥 Cleanup process failed!');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('💥 Unexpected error during cleanup:', error);
      process.exit(1);
    });
}

module.exports = cleanupAdminActivities;
