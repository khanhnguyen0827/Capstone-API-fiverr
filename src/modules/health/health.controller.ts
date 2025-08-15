import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseController } from '../../common/base';
import { InitService } from '../../init/init.service';

@ApiTags('Health')
@Controller('health')
export class HealthController extends BaseController {
  constructor(private readonly initService: InitService) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Kiểm tra trạng thái hệ thống',
    description: 'Kiểm tra sức khỏe của API và database'
  })
  @ApiResponse({
    status: 200,
    description: 'Hệ thống hoạt động bình thường',
    schema: {
      example: {
        statusCode: 200,
        message: 'Hệ thống hoạt động bình thường',
        content: {
          status: 'healthy',
          database: 'connected',
          users: 5,
          jobs: 12,
          jobTypes: 8,
          categories: 25,
          environment: 'development',
          timestamp: '2024-01-20T10:30:00.000Z'
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/health',
        method: 'GET'
      }
    }
  })
  async getHealth() {
    const systemStatus = await this.initService.getSystemStatus();
    
    if (systemStatus.status === 'healthy') {
      return this.createSuccessResponse(
        systemStatus,
        'Hệ thống hoạt động bình thường'
      );
    } else {
      return this.createSuccessResponse(
        systemStatus,
        'Hệ thống có vấn đề'
      );
    }
  }

  @Get('ping')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Ping test',
    description: 'Kiểm tra API có phản hồi không'
  })
  @ApiResponse({
    status: 200,
    description: 'Pong response',
    schema: {
      example: {
        statusCode: 200,
        message: 'Pong',
        content: {
          message: 'Pong',
          timestamp: '2024-01-20T10:30:00.000Z'
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/health/ping',
        method: 'GET'
      }
    }
  })
  async ping() {
    return this.createSuccessResponse(
      { 
        message: 'Pong',
        timestamp: new Date().toISOString()
      },
      'Pong'
    );
  }

  @Get('ready')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Kiểm tra sẵn sàng',
    description: 'Kiểm tra hệ thống đã sẵn sàng nhận request chưa'
  })
  @ApiResponse({
    status: 200,
    description: 'Hệ thống sẵn sàng',
    schema: {
      example: {
        statusCode: 200,
        message: 'Hệ thống sẵn sàng',
        content: {
          ready: true,
          timestamp: '2024-01-20T10:30:00.000Z'
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/health/ready',
        method: 'GET'
      }
    }
  })
  async ready() {
    try {
      const systemStatus = await this.initService.getSystemStatus();
      const isReady = systemStatus.status === 'healthy';
      
      return this.createSuccessResponse(
        { 
          ready: isReady,
          timestamp: new Date().toISOString()
        },
        isReady ? 'Hệ thống sẵn sàng' : 'Hệ thống chưa sẵn sàng'
      );
    } catch (error) {
      return this.createSuccessResponse(
        { 
          ready: false,
          timestamp: new Date().toISOString(),
          error: error.message
        },
        'Hệ thống chưa sẵn sàng'
      );
    }
  }
}
