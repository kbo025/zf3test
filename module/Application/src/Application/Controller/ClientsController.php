<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;
use Application\Model\Client;

class ClientsController extends AbstractActionController
{
    public function indexAction()
    {
        return new ViewModel();
    }

    public function searchAction()
    {
        if ($this->getRequest()->isXmlHttpRequest()) {
            $client = new Client();
            $query = $this->getRequest()->getQuery();
            $data = $client->search (
                isset($query['page']) ? $query['page'] : 1, 
                isset($query['query']) ? $query['query'] : null,
                isset($query['limit']) ? $query['limit'] : null
            );
            if ($data) {
                return new JsonModel([
                    'success' => true,
                    'msg' => 'OK',
                    'total' => $data['metadata']['total'],
                    'items' => $data['data']
                ]);
            }
            $this->getResponse()->setStatusCode(404);
            return new JsonModel(['code' => 400, 'message' => 'Bad Request','data' => $data]);
        }
        $this->getResponse()->setStatusCode(404);
    }

    public function saveAction()
    {
        if ($this->getRequest()->isXmlHttpRequest()) {
            $data = json_decode($this->getRequest()->getContent(),true);
            $client = new Client($data);
            $response = $client->save(); 
            if ($response)
                return new JsonModel([
                    'success' => true,
                    'msg' => 'OK',
                    'data' => $response
                ]);
            else
                return new JsonModel(['success' => false, 'message' => 'Bad Request']);
        }
        $this->getResponse()->setStatusCode(404);
        return new JsonModel(['success' => false, 'message' => 'Bad Request']);
    }

    public function deleteAction()
    {
        if ($this->getRequest()->isXmlHttpRequest()) {
            $data = json_decode($this->getRequest()->getContent(),true);
            $client = new Client($data);
            if ($client->delete())
                return new JsonModel([
                    'success' => true,
                    'msg' => 'OK',
                    'data' => $client->serialize()
                ]);
            else
                return new JsonModel(['success' => false, 'message' => 'Bad Request']);
        }
        $this->getResponse()->setStatusCode(404);
    }
}
